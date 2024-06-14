import { db } from "../config/firebase-config";

const USERS_COLLECTION = 'users';

type userDetails = {
    userName: string,
    userEmailId: string,
}

const addNewUser = async (userDetails: userDetails) => {
    console.log(userDetails)
    const addUser = db.collection(USERS_COLLECTION).doc();
    const userData = {
        id: addUser.id,
        userName: userDetails.userName,
        userEmailId: userDetails.userEmailId
    }
    const addUserResult = await addUser.set(userData);
    console.log('-----', addUserResult, '-----')
    return { id: addUser.id, userName: userDetails.userName, userEmailId: userDetails.userEmailId }
};

const userList = async () => {
    const allUserDetails: userDetails[] = [];
    const getUserList = await db.collection(USERS_COLLECTION).get();
    getUserList.forEach((userDetails: any) => allUserDetails.push(userDetails.data()));
    return allUserDetails
}

const getUserDetail = async (userId: string) => {
    const userData = db.collection(USERS_COLLECTION).doc(userId);
    const userDetail = await userData.get();
    if (userDetail) {
        return userDetail.data();
    } else {
        throw new Error('User not found');
    }
}

const updateUserDetails = async (userDetails: { id: string; userName?: string; userEmailId?: string; }) => {
    const updateUser = db.collection(USERS_COLLECTION).doc(userDetails.id);
    console.log(userDetails.id, userDetails.userName, userDetails.userEmailId)
    const currentData = (await updateUser.get()).data() || {};
    const userData = {
        id: userDetails.id,
        userName: userDetails.userName || currentData.userName,
        userEmailId: userDetails.userEmailId || currentData.userEmailId
    }
    await updateUser.set(userData).catch((error) => {
        if (error instanceof Error) {
            console.log(error)
            return error
        } else {
            console.log(error)
            return error
        }
    });
    return { id: userDetails.id, userName: userDetails.userName, userEmailId: userDetails.userEmailId }
}


export { addNewUser, getUserDetail, userList, updateUserDetails };