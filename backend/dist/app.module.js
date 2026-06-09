"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const units_module_1 = require("./units/units.module");
const leads_module_1 = require("./leads/leads.module");
const projects_module_1 = require("./projects/projects.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const supervisions_module_1 = require("./supervisions/supervisions.module");
const articles_module_1 = require("./articles/articles.module");
const seo_pages_module_1 = require("./seo-pages/seo-pages.module");
const testimonials_module_1 = require("./testimonials/testimonials.module");
const customers_module_1 = require("./customers/customers.module");
const settings_module_1 = require("./settings/settings.module");
const categories_module_1 = require("./categories/categories.module");
const media_module_1 = require("./media/media.module");
const operations_module_1 = require("./operations/operations.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'uploads'),
                serveRoot: '/uploads',
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'public'),
                serveStaticOptions: {
                    setHeaders: (res, path) => {
                        if (path.endsWith('index.html')) {
                            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                        }
                    },
                },
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            units_module_1.UnitsModule,
            leads_module_1.LeadsModule,
            projects_module_1.ProjectsModule,
            dashboard_module_1.DashboardModule,
            supervisions_module_1.SupervisionsModule,
            articles_module_1.ArticlesModule,
            seo_pages_module_1.SeoPagesModule,
            testimonials_module_1.TestimonialsModule,
            customers_module_1.CustomersModule,
            settings_module_1.SettingsModule,
            categories_module_1.CategoriesModule,
            media_module_1.MediaModule,
            operations_module_1.OperationsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map