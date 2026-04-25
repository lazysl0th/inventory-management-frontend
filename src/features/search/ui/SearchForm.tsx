import { useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import { SETTINGS } from '@/shared/config/constants'
import { Button } from '@/shared/ui/Button'
import { ISearchForm } from '../model/types'
import { FormProvider, Input } from '@/shared/ui/Form'

const SearchForm: React.FC = () => {
    const navigate = useNavigate()

    const submitHandler = (values: ISearchForm) => {
        if (values.searchQuery)
            navigate(
                `${SETTINGS.routes.search}?q=${encodeURIComponent(values.searchQuery)}`
            )
    }

    const initialValues = { searchQuery: '' }

    const formikConfig = {
        initialValues,
        onSubmit: submitHandler,
    }

    return (
        <FormProvider<ISearchForm> config={formikConfig}>
            <Input name='searchQuery' type='search'>
                <Button variant='dark' type='submit'>
                    <FaSearch />
                </Button>
            </Input>
        </FormProvider>
    )
}

export default SearchForm
