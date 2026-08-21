import { NextFunction, Request, Response } from "express";
import attachmentService from "../services/attachments.service";

export const PresignAttachment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fileName, mimeType, fileSize } = req.body;

        const { uploadUrl, objectKey } = await attachmentService.generatePresignedUrl(fileName, mimeType, fileSize);

        res.status(200).json({
            success: true,
            message: "Presigned URL generated successfully",
            data: { uploadUrl, objectKey }
        });
    } catch (error: any) {
        next(error);
    }
};