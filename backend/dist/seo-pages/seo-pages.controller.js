"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeoPagesController = void 0;
const common_1 = require("@nestjs/common");
const seo_pages_service_1 = require("./seo-pages.service");
let SeoPagesController = class SeoPagesController {
    seopagesService;
    constructor(seopagesService) {
        this.seopagesService = seopagesService;
    }
    create(createDto) {
        return this.seopagesService.create(createDto);
    }
    findAll() {
        return this.seopagesService.findAll();
    }
    findOne(id) {
        return this.seopagesService.findOne(+id);
    }
    update(id, updateDto) {
        return this.seopagesService.update(+id, updateDto);
    }
    remove(id) {
        return this.seopagesService.remove(+id);
    }
};
exports.SeoPagesController = SeoPagesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SeoPagesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SeoPagesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SeoPagesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SeoPagesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SeoPagesController.prototype, "remove", null);
exports.SeoPagesController = SeoPagesController = __decorate([
    (0, common_1.Controller)('seopages'),
    __metadata("design:paramtypes", [seo_pages_service_1.SeoPagesService])
], SeoPagesController);
//# sourceMappingURL=seo-pages.controller.js.map