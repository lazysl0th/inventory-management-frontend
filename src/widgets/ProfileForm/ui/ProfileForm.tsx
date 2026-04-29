import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Row, Col, Card } from 'react-bootstrap'
import { CiEdit } from 'react-icons/ci'
import { FaRegAddressCard } from 'react-icons/fa'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { skipToken } from '@reduxjs/toolkit/query'
import type { IProfileForm, TSubmitHandler } from '../model/types'
import { Tooltip } from '@/shared/ui/Tooltip'
import { Button } from '@/shared/ui/Button'
import { profileSchema } from '../model/validation'
import { AppModals, openModal, showToast } from '@/shared/model/ui'
import { useGetUserQuery, useUpdateUserMutation } from '@/entities/user'
import { FormProvider } from '@/shared/ui/Form/ui/FormProvider'
import { Input } from '@/shared/ui/Form/ui/Input'
import { Select } from '@/shared/ui/Form/ui/Select'
import { useCurrentUser } from '@/entities/user/lib/useCurrentUser'

const ProfileForm = () => {
    const [isEdit, setIsEdit] = useState(false)
    const { userId } = useParams()
    const dispatch = useDispatch()
    const { t, i18n } = useTranslation('user')
    const currentLanguage = i18n.language
    const { isAdmin, currentUser } = useCurrentUser()
    const [updateUser] = useUpdateUserMutation()

    const { data: user } = useGetUserQuery(userId || skipToken)

    const submitHandler: TSubmitHandler = async (values) => {
        const { language, theme, ...userData } = values
        if (!isEdit) {
            try {
                i18n.changeLanguage(language)
                document.body.dataset.bsTheme = theme
                await updateUser({
                    id: user?.id || currentUser?.id,
                    ...userData,
                }).unwrap()
                dispatch(
                    showToast({ message: t('user:toasts.updateUserSuccess') })
                )
            } catch (e) {
                dispatch(
                    showToast({ message: t('user:toasts.updateUserFailed') })
                )
                console.log(e)
            }
        }
    }

    const initialValues = {
        name: user ? user.name : currentUser?.name || '',
        email: user ? user.name : currentUser?.email || '',
        language: currentLanguage,
        theme: 'light',
    }

    const formikConfig = {
        initialValues,
        validationSchema: profileSchema,
        onSubmit: submitHandler,
        enableReinitialize: true,
    }

    const editTooltip = <Tooltip tooltip={t('user:actions.editPersonalData')} />
    const additionalInfoTooltip = (
        <Tooltip tooltip={t('user:tooltip.additionalInfo')} />
    )

    return (
        <Row className='g-2'>
            <Col>
                <Card className='text-center shadow-sm'>
                    <Card.Body>
                        <FormProvider<IProfileForm> config={formikConfig}>
                            <Card.Text className='d-flex justify-content-end mb-1'>
                                {(isAdmin || !userId) && (
                                    <Button
                                        name='additionalInfo'
                                        placement='top'
                                        overlay={additionalInfoTooltip}
                                        variant='outline-dark'
                                        className='border-0 p-1 me-2'
                                        onClick={() =>
                                            dispatch(
                                                openModal({
                                                    name: AppModals.AdditionalInfo,
                                                })
                                            )
                                        }
                                    >
                                        <FaRegAddressCard size={24} />
                                    </Button>
                                )}
                                {!userId && (
                                    <Button
                                        name='editPersonalData'
                                        placement='top'
                                        overlay={editTooltip}
                                        variant='outline-dark'
                                        type='submit'
                                        className='border-0 p-1'
                                        onClick={() => setIsEdit(!isEdit)}
                                    >
                                        <CiEdit size={24} />
                                    </Button>
                                )}
                            </Card.Text>
                            <fieldset disabled={!isEdit}>
                                {isEdit ? (
                                    <Input
                                        name='name'
                                        type='text'
                                        placeholder={t(
                                            'common:placeholders.name'
                                        )}
                                        className='text-center mb-2'
                                    />
                                ) : (
                                    <Card.Title>
                                        {user ? user.name : currentUser?.name}
                                    </Card.Title>
                                )}
                                {isEdit ? (
                                    <Input
                                        name='email'
                                        type='email'
                                        placeholder={t(
                                            'common:placeholders.email'
                                        )}
                                        className='text-center'
                                    />
                                ) : (
                                    <Card.Subtitle className='mb-2 text-muted'>
                                        {user ? user.email : currentUser?.email}
                                    </Card.Subtitle>
                                )}

                                {!user && (
                                    <fieldset className='text-start'>
                                        <Card.Text className='m-1'>
                                            <strong>
                                                {t('user:legends.preferences')}
                                            </strong>
                                        </Card.Text>
                                        <Select
                                            name='language'
                                            label={t('user:labels.language')}
                                            className='mb-1'
                                        >
                                            <option value='en'>
                                                {t('user:options.english')}
                                            </option>
                                            <option value='es'>
                                                {t('user:options.spanish')}
                                            </option>
                                            <option value='ua'>
                                                {t('user:options.ukrainian')}
                                            </option>
                                        </Select>

                                        <Select
                                            name='theme'
                                            label={t('user:labels.theme')}
                                        >
                                            <option value='dark'>
                                                {t('user:options.dark')}
                                            </option>
                                            <option value='light'>
                                                {t('user:options.light')}
                                            </option>
                                        </Select>
                                    </fieldset>
                                )}
                            </fieldset>
                        </FormProvider>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default ProfileForm
