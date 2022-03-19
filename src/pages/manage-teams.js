import React, {useEffect, useState} from 'react';
import {getFlags, getTeams} from "../api/teams_api";
import EditableGridTableComponent from "../shared/components/editable-grid-table";
import {$host} from "../api";
import {FORM_CONTROL_TYPE} from "../shared/utils/constants";
import {TeamCustomEditorForm} from "../components/custom-forms";
import {getCurrentStageInTournament} from "../api/stage_api";

const ManageTeams = () => {

    const [teams, setTeams] = useState([]);
    const [flags, setFlags] = useState([]);
    useEffect(async () => {
        const loadedTeams = await getTeams()
        setTeams(loadedTeams)
        const loadedFlags = await getFlags();
        setFlags(loadedFlags);
    }, [])

    const flagCell = (e) => {
        return <td className="flex justify-center">
            { e.dataItem.flag && <img className="w-10 h-8" src={$host.defaults.baseURL + e.dataItem.flag}/> }
        </td>
    }

    return (
        <div className="h-full">
            <EditableGridTableComponent
                columns={[
                    {field: 'id', title: 'ID'},
                    {field: 'flag', title: 'Флаг', cell: flagCell},
                    {field: 'name', title: 'Команда'},
                    {field: 'countryCode', title: 'Код'}
                ]}
                dataSource={teams}
                sourceUrl={$host.defaults.baseURL+'/api/teams/'}
                model={
                    [
                        {name: 'name', type: FORM_CONTROL_TYPE.STRING, available:[], label: 'Название команды'},
                        {name: 'flag', type: FORM_CONTROL_TYPE.STRING, available: flags, label: 'Флаг'},
                        {name: 'countryCode', type: FORM_CONTROL_TYPE.STRING, available: [], label: 'Код страны'},
                    ]
                }/>
        </div>
    );
};

export default ManageTeams;
