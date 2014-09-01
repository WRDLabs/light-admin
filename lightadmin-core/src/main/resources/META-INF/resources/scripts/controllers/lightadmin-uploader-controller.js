/*
 * Copyright 2012-2014 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * TODO: Document me!
 *
 * @author Maxim Kharchenko (kharchenko.max@gmail.com)
 */
function selectFileFieldValue(form, attr, attr_value, restRepoUrl) {
    var editor = form.find('[name="' + attr + '"]');
    var field_name = $(editor).attr('name');
    var url = restRepoUrl + '/' + attr + '/file';

    var uploader_container = $(editor).parent('div');

    var remove_button = $('span.action.remove', uploader_container);
    var add_button = $("span.action.add", uploader_container);

    var plupload_container = $(uploader_container).parent('div');

    var uploader = $(plupload_container).data('plupload');

    var picture_container_id = field_name + '-picture-container';

    var picture_container_html = "<div id='" + picture_container_id + "' style='margin-top:10px;'>" + FieldValueRenderer.render(attr_value, 'formView') + "</div>";

    $('span.filename', uploader_container).html('File selected');

    uploader_container.after(picture_container_html);

    add_button.hide();
    remove_button.show();

    remove_button.click(function () {
        jConfirm('Are you sure you want to remove this file from server? It won\'t be recoverable!', 'Confirmation Dialog', function (r) {
            if (r) {
                $.ajax({
                    type: 'DELETE',
                    url: url,
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function () {
                        $(editor).val('');
                        $('#' + picture_container_id).remove();
                        remove_button.hide();
                        add_button.show();

                        if (uploader.files.length > 0) {
                            $.each(uploader.files, function () {
                                uploader.removeFile(this);
                            });
                            uploader.refresh();
                        }

                        $('span.filename', uploader_container).html('No file selected');
                    },
                    statusCode: {
                        409: function (jqXHR) {
                            var errorMessage = $.parseJSON(jqXHR.responseText)['message'];
                            jAlert(errorMessage, 'Remove operation failure');
                        }
                    }
                });
            }
        });
    });
}