import { getFullDate } from "../common/date";

const UserCardAdmin = ({ user, handleRoleChange }) => {

    let { personal_info: { fullname, email, profile_img }, _id, role, joinedAt } = user;

    return (
        <>
            <tr className="hover:bg-grey transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <img className="h-10 w-10 rounded-full" src={profile_img} alt={fullname}
                        />
                        <div className="ml-4">
                            <div className="text-sm font-medium text-black capitalize">{fullname} </div>
                            <div className="text-sm text-dark-grey">{email}</div>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${role === 'admin' ? 'bg-purple/20 text-purple/90' : 'bg-green-100 text-green-800'}`}>
                        {role === 'admin' ? <i className="fi fi-rr-crown mr-1 mt-1" /> : <i className="fi fi-rr-user mr-1 mt-1" />}
                        {role}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getFullDate(joinedAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                        {role === 'user' ? (
                            <button onClick={() => handleRoleChange(_id, 'admin')} className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-purple/90 bg-purple/20 hover:bg-purple/10 transition-colors duration-200">
                                <i className="fi fi-rr-crown mt-1 mr-1" />
                                Make Admin
                            </button>
                        ) : (
                            <button onClick={() => handleRoleChange(_id, 'user')} className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 transition-colors duration-200">
                                <i className="fi fi-rr-user-add mt-1 mr-1" />
                                Make User
                            </button>
                        )}
                    </div>
                </td>
            </tr>
        </>
    )
}

export default UserCardAdmin