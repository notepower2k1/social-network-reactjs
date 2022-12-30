import React ,{useState,useEffect,useRef} from 'react';
import ProfileService from '../../services/ProfileService';
import FirebaseSerive from '../../services/firebaseService';
import AuthService from '../../services/auth.service'
import ReplyService from '../../services/ReplyService'
import TextareaAutosize from 'react-textarea-autosize';
import Form from 'react-bootstrap/Form';
import styled from "styled-components";


const ReplyForm = styled(Form)`
   display:none;
`;

function Reply({increaseRenderValue,index,data}) {
    const [firstName,setFirstName] = useState('');
    const [lastName,setLastName] = useState('');
    const [avatar,setAvatar] = useState(null);

    const [inputReply,setInputReply] = useState("");

    const [isReadonly, setIsReadonly] = useState(true);
   
    const dateReply = new Date().toISOString().slice(0, 10);
    const user = AuthService.getCurrentUser();

    const formRef = useRef([]);
    const inputRef = useRef([]);

    useEffect(()=>{

      ProfileService.getProfile(data.user.id).then((response) => {
          setFirstName(response.data.firstName);
          setLastName(response.data.lastName);
          FirebaseSerive.getAvatarFromFirebase(response.data.avatar).then((response) => {
              setAvatar(response)
          })
          
      })

  },[])

  const saveReply = (e,index)=>{

    var reply = inputReply;
    var comment = data.comment
    const temp = {reply,dateReply,user,comment}

    
    ReplyService.createReply(temp).then((res)=>{
        increaseRenderValue()
    }).catch((err)=>{
        console.log(err)
    });
    
    setInputReply("")
    const currentForm = formRef.current[index];
    currentForm.style.display = "none";
  }


  const updateComment = (inputUpdateReply,id)=>{
  
    var reply = inputUpdateReply;
    var comment = data.comment

    const temp = {reply,dateReply,user,comment}

    
    ReplyService.updateReply(id,temp).then((res)=>{
      alert("Update Sucess!")
    
  }).catch((err)=>{
      console.log(err)
  });
    
   

   
  }
  const deleteReply = ((id) =>{
    ReplyService.deleteReply(id).then((res)=>{
      alert("Delete Sucess!")
      increaseRenderValue();


  }).catch((err)=>{
      console.log(err)
  })
  });


  const handlerCreate = () => {
      const currentForm = formRef.current[index];
      if (currentForm) {
  
       
        if (currentForm.style.display === "none" || currentForm.style.display === "") {
          currentForm.style.display = "block";
        } else {
          currentForm.style.display = "none";
        }
      }
    }

  
  

  
    const handlerUpdate = (e,commentReplyID) => {
      const currentInput = inputRef.current;

      if (currentInput) {
        currentInput.focus()
        setIsReadonly(prevState => !prevState);
      
        if (isReadonly){
          e.target.style.backgroundColor = 'lightblue'
        }
        else{
          e.target.style.backgroundColor = 'transparent';
          
          if(window.confirm('Delete the item?')){
            const inputUpdateReply = currentInput.value ;
            
            updateComment(inputUpdateReply,commentReplyID);
          }
          else{
          }
        
    }
      }
    };  
  



  return (
    <>
    <div class="comet-avatar">
    <img src={avatar} className="rounded-circle avatar shadow-4" alt="Avatar"/>
  </div>
  <div class="we-comment">
    <div class="coment-head">
      <h5>{firstName} {lastName}</h5>
      <span>{data.dateReply}</span>
     
    </div>
    <TextareaAutosize
       id="TextAreaResizeable"
       cacheMeasurements
       defaultValue = {data.reply}
       readOnly ={isReadonly}
       ref={inputRef} 

       >         
       </TextareaAutosize>  
       <div className="d-flex we-reply">
         <div className="feature">
         <span className='icon feedback-icon mr-2' onClick={(e) => handlerCreate()}> 
         <i className="fa fa-reply"></i>

        </span>
         <span className='icon delete-icon mr-2 ' onClick={()=> {if(window.confirm('Delete the item?')){deleteReply(data.id)}}}> 
         <i className="fa fa-trash"></i>

     </span>
     <span className='icon edit-icon mr-2' onClick={(e) => handlerUpdate(e,data.id)}> 
     <i className="fa fa-edit"></i>
     </span>     
           </div>
     <p className="ms-3 card-text">{data.dateReply}</p>
     </div> 
      </div>

      

      <ul>
      <li>
       <ReplyForm  ref={el => formRef.current[index] = el}> 
       <div class="comet-avatar">
        <img src={avatar} className="rounded-circle avatar shadow-4" alt="Avatar" />
        </div>
        <div class="we-comment">
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
        </ReplyForm>  
        </li>
        </ul>
  </>
  )
}

export default Reply;