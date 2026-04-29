import { useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import { Button } from '@/shared/ui/Button'
import type { ISearchForm } from '../model/types'
import { useTranslation } from 'react-i18next'
import { FormProvider } from '@/shared/ui/Form/ui/FormProvider'
import { Input } from '@/shared/ui/Form/ui/Input'
import { SEARCH } from '@/shared/config/constants'

const SearchForm = () => {
    const navigate = useNavigate();
    const {t} = useTranslation('common')

    const submitHandler = (values: ISearchForm) => {
        if (values.searchQuery)
            navigate(
                `${SEARCH}?q=${encodeURIComponent(values.searchQuery)}`
            )
    }

    const initialValues = { searchQuery: '' }

    const formikConfig = {
        initialValues,
        onSubmit: submitHandler,
    }

    return (
        <FormProvider<ISearchForm> config={formikConfig}>
            <Input name='searchQuery' type='search' placeholder={t('common:placeholders.search')}>
                <Button variant='dark' type='submit'>
                    <FaSearch />
                </Button>
            </Input>
        </FormProvider>
    )
}

export default SearchForm
