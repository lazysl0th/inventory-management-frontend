import { useSearchParams } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { InventoryList } from '@/widgets/InventoryList'

const SearchPage: React.FC = () => {
    const [searchParams] = useSearchParams()
    const query = searchParams.get('q')

    const searchParam = query ? { query } : undefined

    return (
        <Container className='pt-2 pb-5'>
            <InventoryList searchParam={searchParam}>
                <h2 className='mb-0'>Search results</h2>
            </InventoryList>
        </Container>
    )
}

export default SearchPage
