import { Type } from '@nestjs/common';

/** Claves de metadata que usa @nestjs/swagger en @ApiProperty */
const API_MODEL_PROPERTIES = 'swagger/apiModelProperties';
const API_MODEL_PROPERTIES_ARRAY = 'swagger/apiModelPropertiesArray';

type ApiPropertyMetadata = {
    example?: unknown;
    examples?: Record<string, { value?: unknown }>;
    default?: unknown;
    isArray?: boolean;
};

/**
 * Construye un objeto de ejemplo a partir de los @ApiProperty({ example }) del DTO.
 */
export function buildDtoExampleFromModel(model: Type<unknown>): Record<string, unknown> | undefined {
    const prototype = model?.prototype;
    if (!prototype) {
        return undefined;
    }

    const propertiesArray: string[] =
        Reflect.getMetadata(API_MODEL_PROPERTIES_ARRAY, prototype) ?? [];

    const propertyKeys = propertiesArray
        .filter((key): key is string => typeof key === 'string' && key.startsWith(':'))
        .map((key) => key.slice(1));

    if (propertyKeys.length === 0) {
        return undefined;
    }

    const example: Record<string, unknown> = {};
    let hasAny = false;

    for (const key of propertyKeys) {
        const metadata = Reflect.getMetadata(
            API_MODEL_PROPERTIES,
            prototype,
            key,
        ) as ApiPropertyMetadata | undefined;

        const value = resolveExampleFromMetadata(metadata);
        if (value !== undefined) {
            example[key] = value;
            hasAny = true;
        }
    }

    return hasAny ? example : undefined;
}

function resolveExampleFromMetadata(metadata?: ApiPropertyMetadata): unknown {
    if (!metadata) {
        return undefined;
    }

    if (metadata.example !== undefined) {
        return metadata.example;
    }

    if (metadata.examples && typeof metadata.examples === 'object') {
        const first = Object.values(metadata.examples)[0];
        if (first && 'value' in first && first.value !== undefined) {
            return first.value;
        }
    }

    if (metadata.default !== undefined) {
        return metadata.default;
    }

    return undefined;
}
