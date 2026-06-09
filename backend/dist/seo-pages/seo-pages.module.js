"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeoPagesModule = void 0;
const common_1 = require("@nestjs/common");
const seo_pages_service_1 = require("./seo-pages.service");
const seo_pages_controller_1 = require("./seo-pages.controller");
let SeoPagesModule = class SeoPagesModule {
};
exports.SeoPagesModule = SeoPagesModule;
exports.SeoPagesModule = SeoPagesModule = __decorate([
    (0, common_1.Module)({
        controllers: [seo_pages_controller_1.SeoPagesController],
        providers: [seo_pages_service_1.SeoPagesService],
    })
], SeoPagesModule);
//# sourceMappingURL=seo-pages.module.js.map