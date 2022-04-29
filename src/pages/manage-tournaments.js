import React, {useEffect, useState} from 'react'
import "../components/Text_border_css.css";
import EditableGridTableComponent from "../shared/components/editable-grid-table";
import {getTournaments} from "../api/tournament_api";
import {FORM_CONTROL_TYPE, transformDate} from "../shared/utils/constants";
import {$host} from "../api";

const ManageTournaments = () => {

    const [tournaments, setTournaments] = useState([]);
    useEffect(async () => {
        const loadedTournaments = await getTournaments()
        setTournaments(loadedTournaments)
    }, []);
    console.log("tournamens", tournaments)

    return (
        <>
            <div className="h-full">
                <EditableGridTableComponent
                    columns={[
                        {field: 'id', title: 'ID'},
                        {field: 'name', title: 'Турнир'},
                        {field: 'startDate', title: 'Дата Начала'},
                        {field: 'endDate', title: 'Дата Завершения'}
                    ]}
                    dataSource={tournaments}
                    sourceUrl={$host.defaults.baseURL+'/api/tournaments/'}
                    model={
                        [
                            {name: 'name', type: FORM_CONTROL_TYPE.STRING, available:[]},
                            {name: 'endDate', type: FORM_CONTROL_TYPE.DATE, available: []},
                            {name: 'startDate', type: FORM_CONTROL_TYPE.DATE, available: []},
                        ]
                    }/>
            </div>
        </>
    );
};

export default ManageTournaments;

