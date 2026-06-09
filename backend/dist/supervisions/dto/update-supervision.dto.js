"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSupervisionDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_supervision_dto_1 = require("./create-supervision.dto");
class UpdateSupervisionDto extends (0, mapped_types_1.PartialType)(create_supervision_dto_1.CreateSupervisionDto) {
}
exports.UpdateSupervisionDto = UpdateSupervisionDto;
//# sourceMappingURL=update-supervision.dto.js.map