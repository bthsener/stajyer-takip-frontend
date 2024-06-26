import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CommentListItem from '../../component/Comment/CommentListItem'
import './Project.css'
import ProfileCard from '../../component/Profile/ProfileCard'
import ProjectUsersCard from '../../component/User/ProjectUsersCard'
import THeader from '../../component/TurksatHeader/THeader'
import { Pagination } from '@mui/material'

const Project = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState({
        id: "",
        name: "",
        requirements: "",
        initialDate: "",
        score: "",
        projectStatus: "",
        finishDate: "",
        comments: [],
    });

    const [editedProject, setEditedProject] = useState({
        score: 0,
        name: "",
        requirements: "",
        project_status: "" 
    });

    const { score, name, project_status, requirements } = editedProject;

    const [isEditing, setIsEditing] = useState(false);
    const [isMentor, setIsMentor] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const handleEditClick = () => {
        setIsEditing(true);
        editedProject.name = project.name;
        editedProject.requirements = project.requirements;
        editedProject.score = project.score;
        editedProject.project_status = project.projectStatus;
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleInput = (e) => {
        setEditedProject({ ...editedProject, [e.target.name]: e.target.value });
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        console.log("project edit save 111", editedProject);
        const token = localStorage.getItem("token");
        await axios.request({
            headers: {
                Authorization: `Bearer ${token}`
            },
            method: "PATCH",
            url: `http://localhost:8080/project/${id}/update`,
            data: editedProject
        }).then((response) => {
            console.log("project edited", response);
            setIsEditing(false);
        });
    };

    const getProject = async () => {
        const token = localStorage.getItem("token");
        await axios.request({
            headers: {
                Authorization: `Bearer ${token}`
            },
            method: "GET",
            url: `http://localhost:8080/project/${id}`
        }).then(response => {
            setProject(response.data);
            console.log(response);
        });
    };

    const formattedInitialDate = new Date(project.initialDate).toLocaleDateString();

    useEffect(() => {
        getProject();
        const userRole = localStorage.getItem("userRole");
        if (userRole.includes("ROLE_MENTOR")) {
            setIsMentor(true);
        }
    }, [id, isEditing]);

    const commentsPerPage = 4;
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = project.comments.slice(indexOfFirstComment, indexOfLastComment);

    const renderComments = currentComments.map((comment, index) => (
        <CommentListItem key={index} comment={comment} />
    ));

    const paginate = (event, pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            {isEditing ? (
                <>
                    <THeader />
                    <form onSubmit={(e) => handleSaveEdit(e)}>
                        <div className="inputs">
                            Proje Adı<input className="inputItem" type="text" name="name" id="name" value={name} onChange={(e) => handleInput(e)} />
                            Proje Açıklaması<textarea required className="inputItem" name="requirements" id="requirements" cols="30" rows="10" value={requirements} onChange={(e) => handleInput(e)} />
                            Proje Durumu<select className="inputItem" onSelect={(e) => handleInput(e)}>
                                <option name="projectStatus" value="ONGOING">Devam Ediyor</option>
                                <option name="projectStatus" value="FINISHED">Tamamlandı</option>
                                <option name="projectStatus" value="DROPPED">Duraklatıldı</option>
                            </select>
                            Puan<input className="inputItem" type="number" min="0" max="100" name="score" id="score" value={score} onChange={(e) => handleInput(e)} />
                        </div>
                        <div className="buttons">
                            <button type='submit'>Kaydet</button>
                            <button onClick={handleCancelEdit}>İptal</button>
                        </div>
                    </form>
                    <br />
                    <h4>Kullanıcı Yorumları</h4>
                    {renderComments}
                    <Pagination
                        count={Math.ceil(project.comments.length / commentsPerPage)}
                        page={currentPage}
                        onChange={paginate}
                        color="primary"
                    />
                </>
            ) : (
                <>
                    <THeader />
                    <div className="major-y">
                        <ProjectUsersCard project_id={project.id} />
                        <div className="project">
                            <div className="projectCard">
                                {isMentor ? (<div class="box">
                                    <button class="mybtn">
                                        <div class="container">
                                            <div class="bar1"></div>
                                            <div class="bar2"></div>
                                            <div class="bar3"></div>
                                        </div>
                                    </button>
                                    <div class="dropdownlist">
                                        <a onClick={handleEditClick}>Düzenle</a>
                                    </div>
                                </div>) : (<></>)}
                                <div className="title">{project.name}</div>
                                <div
                                    className='requirements'
                                    dangerouslySetInnerHTML={{
                                        __html: project.requirements.replace(/\n/g, '<br/>')
                                }}/>
                                <div className="details">
                                    <div className="detail-item">Başlangıç Tarihi: {formattedInitialDate}</div>
                                    <div className="detail-item">Proje Durumu: {project.projectStatus}</div>
                                    <div className="detail-item">Proje Puanı: {project.score}</div>
                                </div>
                            </div>
                            <br />
                            <div className="commentButton">
                                <button><a href={`/project/${project.id}/comments/new`}>Yorum Yap</a></button>
                            </div>
                            <div>
                                <h4>Kullanıcı Yorumları</h4>
                                {renderComments}
                                <Pagination
                                    count={Math.ceil(project.comments.length / commentsPerPage)}
                                    page={currentPage}
                                    onChange={paginate}
                                    color="primary"
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Project;
