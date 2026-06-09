import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientValidationError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.BAD_REQUEST;
    let message = 'Dữ liệu không hợp lệ';

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          status = HttpStatus.CONFLICT;
          message = `Dữ liệu bị trùng lặp ở trường: ${(exception.meta?.target as string[])?.join(', ') || 'không xác định'}`;
          break;
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = 'Không tìm thấy bản ghi';
          break;
        case 'P2003':
          status = HttpStatus.BAD_REQUEST;
          message = 'Lỗi khóa ngoại, không thể xóa hoặc cập nhật bản ghi này';
          break;
        default:
          message = `Lỗi Database: ${exception.message}`;
          break;
      }
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      message = 'Thiếu hoặc sai định dạng trường dữ liệu bắt buộc';
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
    });
  }
}
