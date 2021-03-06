import * as React from 'react';
import './HomeProjects.scss';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';

interface HomeProjectsProps {
    id : string;
    name: string;
}

const HomeProjects = observer(( { id, name}: HomeProjectsProps) => {
    return (
    <Link to={`/projects/${id}`}>

        <article className="flex-child projectCont">
        
        <div className="projectDisplay">
        </div>
        <h3 className="projectInfo" key={id}> {name} </h3>
        
        </article>
        </Link>
    )
})
export default HomeProjects;