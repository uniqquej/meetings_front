import React from "react"
import moment from "moment";


const PostPage = (props)=>{
    let {data,userId, children} = props;
    return (
        <div className="post-list">
            {children}
        {data.map((post) => (
                <div className="post-item" key={post.id}>
                    <b><a href={`/post/${post.id}`}>{post.title}</a></b>
                    {post.likes.includes(userId)
                        ?<img src="https://cdn-icons-png.flaticon.com/512/138/138533.png" style={{"width":"20px", "marginLeft":"10px"}} />
                        :<img src="https://cdn-icons-png.flaticon.com/512/138/138454.png" style={{"width":"20px","marginLeft":"10px"}} />}
                    { post.author.nickname===""
                    ?(<p> unknown / {moment(post.created_at).format("YYYY-MM-DD")}</p>)
                    :(<p>{post.author.nickname} / {moment(post.created_at).format("YYYY-MM-DD")}</p>)}
                </div>
        ))}
        </div>
    )
}

const RecruitPage = (props)=>{
    let {data, children} = props;
    return (
        <div className="post-list text-center">
            {children}
        {data.map((recruitment) => (
        <div className="post-item" key={recruitment.id}>
            <b><a href={`/recruit/${recruitment.id}`}>{recruitment.title}</a></b>
            { recruitment.author.nickname===""
            ?(<p> unknown / {moment(recruitment.created_at).format("YYYY-MM-DD")}</p>)
            :(<p>{recruitment.author.nickname} / {moment(recruitment.created_at).format("YYYY-MM-DD")}</p>)}
            <p>({recruitment.applicant_count}/{recruitment.number_of_recruits})</p>
        </div>
))}
</div>
    )
}

export {PostPage,RecruitPage}