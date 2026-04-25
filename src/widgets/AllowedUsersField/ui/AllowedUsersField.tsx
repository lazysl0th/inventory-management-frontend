import { useFormikApi } from '@/shared/lib/hooks/useFormikApi'
import { IAllowedUsersField } from '../model/types'
import { AsyncSelect } from '@/shared/ui/Form'
import { IUser, useLazyGetUsersQuery } from '@/entities/user'
import { TAllowedUser } from '@/entities/inventory'

const AllowedUsersField = ({ name }: IAllowedUsersField) => {
    const [getUsers] = useLazyGetUsersQuery()

    const getOptionLabel = (user: TAllowedUser) => user.email

    const getOptionValue = (user: TAllowedUser) => user.id.toString()

    const formatOptionLabel = (user: TAllowedUser) => user.email

    const { field: allowedUsersField } =
        useFormikApi<TAllowedUser[]>('allowedUsers')

    const loadOptions = async (inputValue: string): Promise<TAllowedUser[]> => {
        const users = await getUsers({ query: inputValue }).unwrap()
        const selectedUserIds = new Set(
            allowedUsersField.value.map((allowedUser) => allowedUser.id)
        )
        return users
            .filter((user) => !selectedUserIds.has(user.id))
            .map((user: IUser) => ({
                id: user.id,
                name: user.name,
                email: user.email,
            }))
    }

    return (
        <AsyncSelect<TAllowedUser, false>
            name={name}
            cacheOptions
            getOptionLabel={getOptionLabel}
            getOptionValue={getOptionValue}
            formatOptionLabel={formatOptionLabel}
            loadOptions={loadOptions}
            defaultOptions={[]}
        />
    )
}

export default AllowedUsersField
