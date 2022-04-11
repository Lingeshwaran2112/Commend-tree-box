
const template = document.createElement("template");


template.innerHTML = `
    <link rel="stylesheet" href="commentBoxStyle.css" />
    <div class="comment-box">
        <div class="comment-edit">
            <input class="comment-input" type="text" />
            <button class="submit-btn">Submit</button>
        </div>
        <div class="comment-display">
            <p class="comment">Comment</p>
            <p class="author">Author:</p>
            <button class="reply-btn">Reply</button>
            <div class="reply-box"></div>
        </div>
    </div>
`;


const nestingLimit = 6;

export class CommentBox extends HTMLElement {
    constructor() {
        
        super();

       
        this.level = this.getAttribute("level")
            ? 
              parseInt(this.getAttribute("level"))
            : 
              0;

       
        this.likeCount = 0;

       
        this.attachShadow({ mode: "open" });

        
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        
        this.commentEdit = this.shadowRoot.querySelector(".comment-edit");
        this.commentDisplay = this.shadowRoot.querySelector(".comment-display");
    }
   
    connectedCallback() {
      
        this.commentEdit
            .querySelector(".submit-btn")
            .addEventListener("click", () => this.commentSubmit());

        
        if (this.level < nestingLimit) {
            this.commentDisplay
                .querySelector(".reply-btn")
                .addEventListener("click", () => this.commentReply());
        } else {
            
            this.commentDisplay.querySelector(".reply-btn").disabled = true;
        }

       
        this.commentDisplay.style.display = "none";
    }

    
    commentSubmit() {
       
        const commentInput = this.commentEdit.querySelector(".comment-input");

        const comment = this.commentDisplay.querySelector(".comment");

       
        const author = this.commentDisplay.querySelector(".author");

      
        comment.innerHTML = commentInput.value;
        
        author.innerHTML = `Author: ${sessionStorage.getItem("currentUser")}`;

        
        this.commentEdit.style.display = "none";
        
        this.commentDisplay.style.display = "block";
    }

    
    

    commentReply() {
        
        const replyBox = this.commentDisplay.querySelector(".reply-box");
        
        const newCommentBox = document.createElement("comment-box");

        
        let newLevel = this.level + 1;
        
        newCommentBox.setAttribute("level", newLevel);
        newCommentBox.level = newLevel;

        
        if (replyBox.childNodes) {
           
            replyBox.insertBefore(newCommentBox, replyBox.childNodes[0]);
        } else {
           
            replyBox.appendChild(newCommentBox);
        }
    }

    
    disconnectedCallback() {
        this.commentEdit.querySelector(".comment-submit").removeEventListener();
        this.commentDisplay.querySelector(".reply-btn").removeEventListener();
        
    }
}
