import * as React from 'react';
import './HomeFolders.scss';
import { observer } from 'mobx-react';

interface HomeFoldersProps {
    name: string;
    numFiles: number;
}

const HomeFolders = observer(( {name, numFiles} : HomeFoldersProps) => {
    return (
        <article className="flex-child row-flex folderCont">
                    <div className="flex-child  folderDisplay col-flex">
                    <h3>{name}</h3>
                    </div>
                    <div className="flex-child  folderInfo">
                     <h1>{numFiles}</h1>
                     <h6>archivos</h6>
                    </div>
                    </article>
    )
})
export default HomeFolders;