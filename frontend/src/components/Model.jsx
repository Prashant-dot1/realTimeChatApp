import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { RxCross2 } from "react-icons/rx"
import { useEffect } from 'react';
// import { searchUsers } from '../apis/auth';
import { addToGroup, removeUser, renameGroup } from '../apis/chat';
import { fetchChats } from '../redux/chatsSlice';
import Search from './Search';
import { getChatName, getChatPhoto } from '../utils/logics';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "fit-content",
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
};
function Model(props) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch()
  const [searchResults, setSearchResults] = useState([])
  const [name, setName] = useState("")
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [members, setMembers] = useState([])
  const { activeChat } = useSelector((state) => state.chats)
  const activeUser = useSelector((state) => state.activeUser)

  const handleOpen = () => {
    setOpen(true);
    setName(getChatName(activeChat, activeUser))
  };
  const handleClose = () => {
    setOpen(false);
    setSearch("")
    setSearchResults([])
  };
  const handleClick = async (e) => {
    if (members.includes(e)) {
      return
    }
    await addToGroup({ userId: e?._id, chatId: activeChat?._id })
    setMembers([...members, e])

  }

  const updateBtn = async () => {
    if (name) {
      let data = await renameGroup({ chatId: activeChat._id, chatName: name })
      if (data) {
        dispatch(fetchChats())
        setOpen(false)
      }
    }
    setOpen(false)
  }
  const deleteSelected = async (ele) => {
    const res = await removeUser({ chatId: activeChat._id, userId: ele._id })
    if (res._id) {
      setMembers(members.filter((e) => e._id !== ele._id))

      dispatch(fetchChats())
      setOpen(false)

    }
    return
  }
  const leaveGroup = async () => {
    const res = await removeUser({ chatId: activeChat._id, userId: activeUser.id })
    if (res._id) {
      dispatch(fetchChats())
      setOpen(false)
    }
    return
  }
  useEffect(() => {
    setMembers(activeChat?.users.map((e) => e))
  }, [activeChat])
  useEffect(() => {
    const searchChange = async () => {
      setIsLoading(true)
      const { data } = await searchUsers(search)
      setSearchResults(data)
      setIsLoading(false)
    }
    searchChange()
  }, [search])
  return (
    <>




      <button onClick={handleOpen}>
        <img alt="Profile Pic" src={getChatPhoto(activeChat, activeUser)} />

      </button>
      {
        activeChat?.isGroup ?

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <h5>{getChatName(activeChat, activeUser)}</h5>
              <div>
                <h6>Members</h6>
                <div >
                  {
                    members.length > 0 && members?.map((e) => {
                      return (
                        <button button>
                          <span>{e._id === activeUser.id ? "You" : e.name}</span>
                          <RxCross2 onClick={() => deleteSelected(e)} />
                        </button>
                      )
                    })
                  }
                </div>
                <div>
                  <form onSubmit={(e) => e.preventDefault()}>
                    <input onChange={(e) => setName(e.target.value)} value={name} type="text" name="chatName" placeholder="Group Name" required />
                    <input onChange={(e) => setSearch(e.target.value)} type="text" name="users" placeholder="add users" />
                  </form>
                  {/* <div style={{ display: search ? "" : "none" }} className='h-[fit-content] bg-[#fff] flex flex-col gap-y-3 pt-3 px-2'> */}

                  {/* <Search isLoading={isLoading} handleClick={handleClick} search={search} searchResults={searchResults} /> */}

                  <div>
                    <button onClick={updateBtn}>Update</button>
                    <button onClick={() => leaveGroup()}>Leave</button>

                  </div>
                </div>
              </div>
            </Box>
          </Modal> : <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div>
                <img src={getChatPhoto(activeChat, activeUser)} alt="" />
                <h2>{getChatName(activeChat, activeUser)}</h2>

                <h3>{!activeChat?.isGroup && activeChat?.users[0]?._id === activeUser.id ? activeChat?.users[1]?.email : activeChat?.users[0]?.email}</h3>
                <div>

                  <h5>{!activeChat?.isGroup && activeChat?.users[0]?._id === activeUser.id ? activeChat?.users[1]?.bio : activeChat?.users[0]?.bio}</h5>
                </div>
              </div>


            </Box>
          </Modal>
      }




    </>
  )
}

export default Model