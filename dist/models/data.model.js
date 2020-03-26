"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Type guard to distinguish between dataclass and dataset
 */
function is_dataset(data) {
    return data.units !== undefined;
}
exports.is_dataset = is_dataset;
//# sourceMappingURL=data.model.js.map