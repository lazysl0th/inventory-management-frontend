import { useContext, useRef } from 'react';
import { useLazyQuery, } from '@apollo/client/react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { useTranslation } from 'react-i18next';
import { components } from "react-select";
import { Form, Row, Col, Image } from "react-bootstrap";
import { CurrentUserContext } from '../../../context/CurrentUserContext';
import { SEARCH_TAGS } from '../../../graphql/queries';
import MarkdownField from './MarkdownField';

export default function InventoryDetailsTab({
    formikValues,
    categories,
    inventoryTags,
    details,
    formikHandlerChange,
    formikErrors,
    formikBlur,
    formikTouched,
    handlerChangeDetails,
    onUploadImage,
    readOnly,
    onShowToast,
    disabled,
}) {
    const currentUser = useContext(CurrentUserContext);
    const [searchTags] = useLazyQuery(SEARCH_TAGS, { fetchPolicy: "no-cache" });
    const imageRef = useRef(null);
    const { t } = useTranslation("inventory");

    const loadOptions = async (inputValue, callback) => {
        const { data } = await searchTags({ variables: { searchQuery: inputValue } });
        const selectedIds = new Set(inventoryTags?.map((tag) => tag.id));
        const options = data?.searchTags?.filter((tag) => !selectedIds.has(tag.id)).map((tag) => ({ value: tag.id, label: tag.name })) ?? [];
        callback(options);
    };

    const handleFormikChange = (e) => {
        formikHandlerChange(e);
        handlerChangeDetails(e.target.name, e.target.value);
    };

    const handleChange = (param) => {
        if (param?.map) handlerChangeDetails('tags', (param).map((o) => ({ id: o.value, name: o.label })));
        else if (param.target.files?.[0]) handlerChangeImage(param);
        else handleFormikChange(param);
    }

    const handleChangeDescription = (name) => (value) => handlerChangeDetails(name, value);

    const handlerChangeImage = async (e) => {
        if (!e.target.files[0]) return;
        try {
            const image = await onUploadImage(e.target.files[0]);
            handlerChangeDetails(e.target.name, image.url);
        } catch (e) {
            imageRef.current.value = '';
            onShowToast(t("toasts.image"), 'bottom-center');
        }
    };

    const CustomMultiValueRemove = () => null;
    const CustomClearIndicator = () => null;

    const handleAddTag = (inputValue) => {
        const name = inputValue.trim();
        if (!name) return;
        const newTag = {
            guid: crypto.randomUUID(),
            id: null,
            name: name,
        };
        handlerChangeDetails('tags', [...inventoryTags || [], newTag]);
    };

    return (
        <Form>
            <fieldset disabled={disabled}>
                <Row className="g-3">
                    <Col xs={12}>
                        <Form.Group controlId="title">
                            <Form.Label className="required">{t("labels.title")}</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={formikValues.title}
                                onChange={handleFormikChange}
                                placeholder="Enter title..."
                                disabled={readOnly}
                                onBlur={formikBlur}
                                isInvalid={formikTouched?.title && !!formikErrors?.title}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {formikErrors?.title}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={8}>
                        <Form.Group controlId="description">
                            <Form.Label>{t("labels.description")}</Form.Label>
                            <MarkdownField
                                value={details.description}
                                onChange={handleChangeDescription('description')}
                                readOnly={disabled}
                                placeholder={t("placeholders.descriptionInventory")}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={4}>
                        <Form.Group controlId="category">
                            <Form.Label className="required">{t("labels.category")}</Form.Label>
                            <Form.Select
                                value={formikValues.category}
                                onChange={handleFormikChange}
                                disabled={readOnly}
                                name="category"
                                isInvalid={formikTouched?.category && !!formikErrors?.category}
                            >
                                <option value="" disabled>{t("options.selectCategory")}</option>
                                { categories?.enumValues?.map((category) => ( 
                                    <option key={category.name} value={category.name}>{t(`categories.${category.name}`)}</option>)) }
                            </Form.Select>
                            <Form.Text className="text-muted">
                                {t("texts.category")}
                            </Form.Text>
                            <Form.Control.Feedback type='invalid'>
                                {formikErrors?.category}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>

                    <Col xs={12} md={4}>
                        <Form.Group controlId="image">
                            <Form.Label>{t("labels.image")}</Form.Label>
                            <div className="d-flex flex-column gap-2">
                                {details?.image ? (
                                    <Image
                                        src={details.image}
                                        alt="Preview"
                                        thumbnail
                                        style={{ maxHeight: 160, objectFit: "cover" }}

                                    />
                                ) : (
                                    <div
                                        className="border rounded d-flex align-items-center justify-content-center p-3 text-muted"
                                        style={{ height: 160 }}
                                    >{t("placeholders.noImage")}</div>)}
                                <Form.Label className="btn btn-outline-primary">
                                    {t("buttons.selectFile")}
                                </Form.Label>
                                <Form.Control
                                    ref={imageRef}
                                    type="file"
                                    name="image"
                                    placeholder="123"
                                    accept="image/*"
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    style={{ display: "none" }}
                                />
                                <Form.Text className="text-muted">{details.image ? '' : t("labels.fileNotSelected")}</Form.Text>
                            </div>
                        </Form.Group>
                    </Col>

                    <Col xs={12} md={8}>
                        <Row className="g-3">
                            <Col xs={12} md={6}>
                                <Form.Group controlId="owner">
                                    <Form.Label>{t("labels.tags")}</Form.Label>
                                    <AsyncCreatableSelect
                                        isMulti
                                        cacheOptions
                                        disabled={disabled}
                                        isClearable={disabled}
                                        defaultOptions
                                        loadOptions={loadOptions}
                                        onChange={handleChange}
                                        onCreateOption={handleAddTag}
                                        components={{
                                            MultiValueRemove: disabled
                                            ? CustomMultiValueRemove
                                            : components.MultiValueRemove,
                                            ClearIndicator: disabled
                                            ? CustomClearIndicator
                                            : components.ClearIndicator,
                                        }}
                                        value={inventoryTags?.map(tag => ({ value: tag.id, label: tag.name }))}
                                        placeholder={'Tags'}
                                        styles={{
                                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                        }}
                                        noOptionsMessage={({ inputValue }) =>
                                            inputValue ? t("placeholders.tagsNoFound") : t("placeholders.tagsEnter")
                                        }
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12} md={6}>
                                <Form.Group controlId="owner">
                                    <Form.Label>{t("labels.owner")}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="owner"
                                        value={details?.owner?.name ?? ''}
                                        readOnly
                                        disabled
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={12} md={6}>
                                <Form.Group controlId="created">
                                    <Form.Label>{t("labels.createdBy")}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="createdAt"
                                            value={details?.createdAt ?? ''}
                                            readOnly
                                            disabled
                                        />
                                </Form.Group>
                            </Col>

                            <Col xs={12} md={6}>
                                <Form.Group controlId="invUpdated">
                                    <Form.Label>{t("labels.updateAt")}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="updateAt"
                                            value={details?.updatedAt ?? ''}
                                            readOnly
                                            disabled
                                        />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </fieldset>
        </Form>
    );
}
