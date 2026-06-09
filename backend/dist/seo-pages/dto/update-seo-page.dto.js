"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSeoPageDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_seo_page_dto_1 = require("./create-seo-page.dto");
class UpdateSeoPageDto extends (0, mapped_types_1.PartialType)(create_seo_page_dto_1.CreateSeoPageDto) {
}
exports.UpdateSeoPageDto = UpdateSeoPageDto;
//# sourceMappingURL=update-seo-page.dto.js.map