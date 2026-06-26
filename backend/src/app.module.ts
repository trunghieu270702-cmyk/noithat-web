import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UnitsModule } from './units/units.module';
import { LeadsModule } from './leads/leads.module';
import { ProjectsModule } from './projects/projects.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SupervisionsModule } from './supervisions/supervisions.module';
import { ArticlesModule } from './articles/articles.module';
import { SeoPagesModule } from './seo-pages/seo-pages.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { CustomersModule } from './customers/customers.module';
import { SettingsModule } from './settings/settings.module';
import { CategoriesModule } from './categories/categories.module';
import { MediaModule } from './media/media.module';
import { OperationsModule } from './operations/operations.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveStaticOptions: {
        setHeaders: (res, path) => {
          if (path.endsWith('index.html')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          }
        },
      },
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    UnitsModule,
    LeadsModule,
    ProjectsModule,
    DashboardModule,
    SupervisionsModule,
    ArticlesModule,
    SeoPagesModule,
    TestimonialsModule,
    CustomersModule,
    SettingsModule,
    CategoriesModule,
    MediaModule,
    OperationsModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
