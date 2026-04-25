import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Row, Col, Card, ListGroup } from 'react-bootstrap'
import { CiEdit } from 'react-icons/ci'
import { FaRegAddressCard } from 'react-icons/fa'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { skipToken } from '@reduxjs/toolkit/query'
import { IProfileForm, TSubmitHandler } from '../model/types'
import { Tooltip } from '@/shared/ui/Tooltip'
import { Button } from '@/shared/ui/Button'
import { profileSchema } from '../model/validation'
import { AppModals, openModal, showToast } from '@/shared/model/ui'
import {
    useCurrentUser,
    useGetUserQuery,
    useUpdateUserMutation,
} from '@/entities/user'
import { FormProvider, Input, Select } from '@/shared/ui/Form'

const ProfileForm: React.FC = () => {
    const [isEdit, setIsEdit] = useState(false)
    const { userId } = useParams()
    const dispatch = useDispatch()
    const { t, i18n } = useTranslation('profile')
    const currentLanguage = i18n.language
    const { isAdmin, currentUser } = useCurrentUser()
    const [updateUser] = useUpdateUserMutation()

    const {
        data: user,
        isLoading: userIsLoading,
        error: userError,
    } = useGetUserQuery(userId || skipToken)

    const submitHandler: TSubmitHandler = async (values) => {
        const { language, theme, ...userData } = values
        if (!isEdit) {
            try {
                i18n.changeLanguage(language)
                document.body.dataset.bsTheme =
                    theme === 'light' ? 'dark' : 'light'
                await updateUser({
                    id: user?.id || currentUser?.id,
                    ...userData,
                }).unwrap()
                dispatch(showToast({ message: t('toasts.updateUserSucces')}))
            } catch (e) {
                dispatch(showToast({message: t('toasts.updateUserFailed')}))
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

    const editTooltip = useMemo(
        () => <Tooltip tooltip='Edit personal data' />,
        []
    )
    const additionalInfoTooltip = useMemo(
        () => <Tooltip tooltip='Additional info' />,
        []
    )

    return (
        <Row className='g-2'>
            <Col>
                <Card className='text-center shadow-sm'>
                    <Card.Body>
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
                        <FormProvider<IProfileForm> config={formikConfig}>
                            <fieldset disabled={!isEdit}>
                                {isEdit ? (
                                    <Input
                                        name='name'
                                        type='text'
                                        placeholder='Name'
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
                                        placeholder='name@example.com'
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
                                            <strong>Preferences</strong>
                                        </Card.Text>
                                        <Select
                                            name='language'
                                            label='Language'
                                            className='mb-1'
                                        >
                                            <option value='en'>
                                                {t('options.english')}
                                            </option>
                                            <option value='es'>
                                                {t('options.spanish')}
                                            </option>
                                            <option value='ua'>
                                                {t('options.ukrainian')}
                                            </option>
                                        </Select>

                                        <Select name='theme' label='Theme'>
                                            <option value='dark'>Dark</option>
                                            <option value='light'>Light</option>
                                        </Select>
                                    </fieldset>
                                )}
                            </fieldset>
                        </FormProvider>
                    </Card.Body>
                </Card>

                <Card className='mt-3 shadow-sm'>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <strong>Inventories:</strong> {50}
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    )
}

export default ProfileForm
