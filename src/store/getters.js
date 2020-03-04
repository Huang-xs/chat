export default {
    getFriendID(state) {
        return (userid) => state.messageList.find(fd => fd._userid === userid);
    }
}