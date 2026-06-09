const fs = require('fs');
const path = require('path');

const models = [
  { module: 'units', classPrefix: 'Units', model: 'unit' },
  { module: 'leads', classPrefix: 'Leads', model: 'lead' },
  { module: 'projects', classPrefix: 'Projects', model: 'project' },
  { module: 'supervisions', classPrefix: 'Supervisions', model: 'supervision' },
  { module: 'articles', classPrefix: 'Articles', model: 'article' },
  { module: 'seo-pages', classPrefix: 'SeoPages', model: 'seoPage' },
  { module: 'testimonials', classPrefix: 'Testimonials', model: 'testimonial' },
  { module: 'customers', classPrefix: 'Customers', model: 'customer' },
  { module: 'settings', classPrefix: 'Settings', model: 'setting' },
];

const backendSrc = path.join(__dirname, 'src');

for (const { module, classPrefix, model } of models) {
  const servicePath = path.join(backendSrc, module, `${module}.service.ts`);
  const controllerPath = path.join(backendSrc, module, `${module}.controller.ts`);

  const serviceContent = `import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ${classPrefix}Service {
  constructor(private prisma: PrismaService) {}

  create(createDto: any) {
    return this.prisma.${model}.create({ data: createDto });
  }

  findAll() {
    return this.prisma.${model}.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.${model}.findUnique({ where: { id } });
  }

  update(id: number, updateDto: any) {
    return this.prisma.${model}.update({
      where: { id },
      data: updateDto,
    });
  }

  remove(id: number) {
    return this.prisma.${model}.delete({ where: { id } });
  }
}
`;

  const controllerContent = `import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ${classPrefix}Service } from './${module}.service';

@Controller('${module.replace('-', '')}')
export class ${classPrefix}Controller {
  constructor(private readonly ${classPrefix.toLowerCase()}Service: ${classPrefix}Service) {}

  @Post()
  create(@Body() createDto: any) {
    return this.${classPrefix.toLowerCase()}Service.create(createDto);
  }

  @Get()
  findAll() {
    return this.${classPrefix.toLowerCase()}Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.${classPrefix.toLowerCase()}Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.${classPrefix.toLowerCase()}Service.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.${classPrefix.toLowerCase()}Service.remove(+id);
  }
}
`;

  if (fs.existsSync(servicePath)) {
    fs.writeFileSync(servicePath, serviceContent);
    console.log(`Updated ${servicePath}`);
  }
  
  if (fs.existsSync(controllerPath)) {
    fs.writeFileSync(controllerPath, controllerContent);
    console.log(`Updated ${controllerPath}`);
  }
}

console.log('Done mapping CRUD');
