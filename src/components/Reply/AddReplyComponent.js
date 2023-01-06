import React ,{useState,useRef,useEffect,useContext} from 'react';

// import Button from '@atlaskit/button';
import ReplyService from '../../services/ReplyService'
import TextareaAutosize from 'react-textarea-autosize';
import AuthService from '../../services/auth.service'
import ProfileService from '../../services/profile.service';
import FirebaseSerive from '../../services/firebase.service';
import { SocketContext } from '../../utils/SocketContext';
import NotificationService from '../../services/notify.service';




function AddReplyComponent({increaseRenderValue,comment}) {
    const socket = useContext(SocketContext);

    const [inputReply,setInputReply] = useState("");
    const user = AuthService.getCurrentUser();
    const formRef = useRef()
    const [firstName,setFirstName] = useState('');
    const [lastName,setLastName] = useState('');
    const [avatar,setAvatar] = useState(null);


    useEffect(()=>{

      ProfileService.getProfile(user.id).then((response) => {
          setFirstName(response.data.firstName);
          setLastName(response.data.lastName);
          FirebaseSerive.getAvatarFromFirebase(response.data.avatar).then((response) => {
              setAvatar(response)
          })
          
      })

  },[])
    const saveReply = (e)=>{
        e.preventDefault();
        var reply = inputReply;

        const temp = {reply,user,comment}
        
        console.log(user.id,comment.post.user.id)
        ReplyService.createReply(temp).then((res)=>{
        
            increaseRenderValue();  

            NotificationService.createNotification(user.id,comment.post.user.id,`/detail/post/${comment.post.id}`,3).then(noty => {
              socket.emit("sendNotification",noty.data)
            })

        }).catch((err)=>{
            console.log(err)
        });
        

        setInputReply("")
      }
  return (
    <div>

             <div className="comet-avatar">
              <img src={avatar} className="rounded-circle avatar shadow-4" alt="Avatar" />
              </div>
              <div className="we-comment">
              <h5>{firstName} {lastName}</h5>
              <TextareaAutosize     
                      id="TextAreaResizeable"     
                      name="inputComment" 
                      placeholder="Viết phản hồi công khai..."     
                      value = {inputReply}
                      onChange= {(e)=> setInputReply(e.target.value)} 
              >
              </TextareaAutosize>  
              <button disabled={!inputReply} className="btn btn-primary float-end" onClick={(e) => saveReply(e)}>Bình luận</button>

              </div>
                 
    </div>
  )
}


export default AddReplyComponent;