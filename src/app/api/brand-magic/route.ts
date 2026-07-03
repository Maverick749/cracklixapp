import { transformLogo } from "@/ai/flows/transform-logo-flow";
import {
  parseRequestBody,
  apiError,
  apiSuccess,
  validateRequiredFields,
  withErrorHandling,
} from "@/lib/api-utils";

async function handler(req: Request) {
  const body = await parseRequestBody<{ logoDataUri: string }>(req);
  if (!body) {
    return apiError("Malformed request body.", 400);
  }

  const validation = validateRequiredFields(body, ["logoDataUri"]);
  if (validation) return validation;

  const { transformedImageDataUri } = await transformLogo({
    logoDataUri: body.logoDataUri,
  });

  return apiSuccess({ transformedImageDataUri });
}

export const POST = withErrorHandling(handler, "BRAND_MAGIC");
