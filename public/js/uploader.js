/**
 * NextBoard - A Modern Bulletin Board System
 * "Where discussions take the next step."
 * 
 * Author: Sam Wilcox
 * Email: sam@nextboard.org
 * Website: https://www.nextboard.org
 * GitHub: https://github.com/samwilcox/nextboard
 * 
 * License: GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007
 * For full license details, visit: https://license.nextboard.org
 */

$(document).ready(() => {
    const uploader = $('.uploader');
    const id = uploader.data('id');

    uploader.on('dragover', e => {
        e.preventDefault();
        e.stopPropagation();
        $('.uploader').addClass('dragging');
    });

    uploader.on('dragleave', e => {
        e.preventDefault();
        e.stopPropagation();
        $('.uploader').removeClass('dragging');
    });

    uploader.on('drop', e => {
        e.preventDefault();
        e.stopPropagation();
        $('.uploader').removeClass('dragging');

        const files = e.originalEvent.dataTransfer.files;

        if (files.length > 0) {
            uploadFile(files[0], id);
        }
    });

    $('.uploaderFileUpload').on('change', e => {
        const files = e.target.files;

        if (files.length > 0) {
            uploadFile(files[0], id);
        }
    });
});

/**
 * Upload a file via AJAX.
 * 
 * @param {File} file - The file to be uploaded. 
 * @param {string} id - The uploader identifier.
 */
const uploadFile = (file, id) => {
    const data = { type: uploadType, uploaderId: id };
    const box = $(`#uploader-preview-${id}`);
    const container = $(`#uploader-preview-container-${id}`);
    const attachments = $(`#uploader-attachments-${id}`);

    ajaxFileUpload('upload', file, data, response => {
        if (response.success) {
            const incData = response.data;
            box.append(incData.preview);

            if (!container.is(":visible")) {
                container.fadeIn();
            }

            if (attachments.val().length === 0) {
                const attachmentsList = [];
                attachmentsList.push({ type: incData.type, id: incData.id });
                attachments.val(JSON.stringify(attachmentsList));
            } else {
                const attachmentsList = JSON.parse(attachments.val());
                const check = { type: incData.type, id: incData.id };

                if (!attachmentsList.some(item => item.type === check.type && item.id === check.id)) {
                    attachmentsList.push(check);
                    attachments.val(JSON.stringify(attachmentsList));
                }
            }
        } else {
            openErrorDialog(response.data.message);
        }
    });
};

/**
 * Manually select a file to upload.
 * 
 * @param {Object} element - The element object instance.
 */
const manualSelect = (element) => {
    const uploadInput = $(`#file-${$(element).data('id')}-input`);
    uploadInput.click();
};

/**
 * Deletes the selected file from disk.
 * 
 * @param {Object} element - The element object instance.
 */
const deleteFile = (element) => {
    const id = parseInt($(element).data('id'), 10);
    const type = $(element).data('type');
    const uploaderId = $(element).data('uploaderid');
    const container = $(`#uploader-preview-container-${uploaderId}`);
    const preview = $(`#uploader-preview-item-${uploaderId}`);
    const attachments = $(`#uploader-attachments-${uploaderId}`);
    const attachmentsList = JSON.parse(attachments.val());
    const data = { type, id };

    ajaxPost('deletefile', data, response => {
        if (response.success) {
            const updatedAttachments = attachmentsList.filter(attachment => attachment.id !== id);
            attachments.val(JSON.stringify(updatedAttachments));
            preview.fadeOut(300, () => $(this).remove());

            if (updatedAttachments.length === 0) {
                container.fadeOut();
            }
        }
    });
};