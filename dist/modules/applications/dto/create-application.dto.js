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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateApplicationDto = exports.AppStatus = void 0;
const class_validator_1 = require("class-validator");
var AppStatus;
(function (AppStatus) {
    AppStatus["APPLIED"] = "APPLIED";
    AppStatus["HR"] = "HR";
    AppStatus["INTERVIEW"] = "INTERVIEW";
    AppStatus["TECH"] = "TECH";
    AppStatus["OFFER"] = "OFFER";
    AppStatus["REJECTED"] = "REJECTED";
    AppStatus["WITHDRAWN"] = "WITHDRAWN";
    AppStatus["HIRED"] = "HIRED";
})(AppStatus || (exports.AppStatus = AppStatus = {}));
class CreateApplicationDto {
}
exports.CreateApplicationDto = CreateApplicationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "company", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "source", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(AppStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateApplicationDto.prototype, "salaryMin", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateApplicationDto.prototype, "salaryMax", void 0);
__decorate([
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "jobPostingUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateApplicationDto.prototype, "description", void 0);
//# sourceMappingURL=create-application.dto.js.map