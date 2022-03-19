import React, {useEffect, useMemo, useState} from 'react';
import Table from "../components/table";
import EditableGridTableComponent from "../shared/components/editable-grid-table/editable-grid-table-component";
import {FORM_CONTROL_TYPE, TABLE_VIEW_MODE} from "../shared/utils/constants";
import {TabStripTab} from "@progress/kendo-react-layout";
import MultipleTablesComponent from "../shared/must-be-rework/multiple-tables-component";
import {ListBox, processListBoxDragAndDrop} from "@progress/kendo-react-listbox";
import {allocateRandomly, getAllGroupsInTournament} from '../api/participant-api'
import {getTeams} from "../api/teams_api";

function AllocateTeams() {
    const tournamentId = 0;
    const [draggedItem, setDraggedItem] = useState([]);
    const [teams, setTeams] = useState([]);
    const [tables, setTables] = useState([]);
    const [allocatedRandomly, setAllocatedRandomly] = useState([]);
    const [groups, setGroups] = useState([]);
    const columnsHeaders = [{title: 'Region', field: 'region'}, {title: 'Team', field: 'team'}];
    const groupsSample = [
        {value: "A", name: "Group A"},
        {value: "B", name: "Group B"},
        {value: "C", name: "Group C"},
        {value: "D", name: "Group D"},
        {value: "E", name: "Group E"},
        {value: "F", name: "Group F"},
    ]
    const optionsSample = [
        {
            id: 1,
            team: 'Belgium'
        },
        {
            id: 2,
            team: 'Germany'
        },
        {
            id: 3,
            team: 'England'
        },
        {
            id: 4,
            team: 'Iceland'
        },
        {
            id: 5,
            team: 'Italy'
        }];
    const tableSample = [
        {
            ID: 0,
            shortname: 1,
            team: "RU"
        }];

    useEffect(async () => {
        const loadedTeams = await getTeams();
        const loadedGroups = await getAllGroupsInTournament(tournamentId);
        setTeams(loadedTeams)
        setGroups(groupsSample);
        setDraggedItem([]);
        setTables(tablesSample);
    }, [])

    const createAllocatedGroupsArray = () => {
        const groupsAllocated = groups.map(data => {
            let groupArray = []
            for(let i in allocatedRandomly){
                if (allocatedRandomly[i].group == data.value){
                    groupArray.push(allocatedRandomly[i].id)
                }
            }

           return {
                [data.value]: groupArray
           }

        });
        console.log("r",groupsAllocated);
       return  groupsAllocated.map((x, i) => ({
            component: (
                <EditableGridTableComponent
                    mode={TABLE_VIEW_MODE.READ}
                    columns={columnsHeaders}
                    dataSource={{
                        ID: x.id,
                        team: teams[x.id].name,
                        region: teams[x.id].region
                    }}
                    >
                </EditableGridTableComponent>
            ),
            title: x.group,
            cols: 1,
            rows: 1,
        }));
    }

    // const handleDragStart = (e) => {
    //     setDraggedItem(e.dataItem)
    // };
    // const handleDrop = (e) => {
    //     let result = processListBoxDragAndDrop(
    //         teams,
    //         table,
    //         draggedItem,
    //         e.dataItem,
    //         "team"
    //     );
    //     setTeams(result.listBoxOneData)
    //     setTable(result.listBoxTwoData)
    //
    // };

    const allocate = async () =>{
        const allocateRandomlyValue = await allocateRandomly(tournamentId);
        setAllocatedRandomly(allocateRandomlyValue);
        createAllocatedGroupsArray();
        setTables(tablesSample);
    }

    const onAllocateRandomly = () => {
       void allocate();
    }

    const tablesSample = [
        {
            component: (
                <EditableGridTableComponent
                    mode={TABLE_VIEW_MODE.READ}
                    columns={columnsHeaders}
                    dataSource={tables}
                    // onDragStart={handleDragStart}
                    // onDrop={handleDrop}
                    >
                </EditableGridTableComponent>
            ),
            title: 'Group A',
            cols: 1,
            rows: 1,
        },
        {
            component: (
                <EditableGridTableComponent
                    mode={TABLE_VIEW_MODE.READ}
                    columns={columnsHeaders}
                    dataSource={tables}>
                </EditableGridTableComponent>
            ),
            title: 'Group B',
            cols: 1,
            rows: 1,
        },
        {
            component: (
                <EditableGridTableComponent
                    mode={TABLE_VIEW_MODE.READ}
                    columns={columnsHeaders}
                    dataSource={tables}>
                </EditableGridTableComponent>
            ),
            title: 'Group C',
            cols: 1,
            rows: 1,
        },
        {
            component: (
                <EditableGridTableComponent
                    mode={TABLE_VIEW_MODE.READ}
                    columns={columnsHeaders}
                    dataSource={tables}>
                </EditableGridTableComponent>
            ),
            title: 'Group D',
            cols: 1,
            rows: 1,
        },
        {
            component: (
                <EditableGridTableComponent
                    mode={TABLE_VIEW_MODE.READ}
                    columns={columnsHeaders}
                    dataSource={tables}>
                </EditableGridTableComponent>
            ),
            title: 'Group E',
            cols: 1,
            rows: 1,
        }, {

            component: (
                <EditableGridTableComponent
                    mode={TABLE_VIEW_MODE.READ}
                    columns={columnsHeaders}
                    dataSource={tables}>
                </EditableGridTableComponent>
            ),
            title: 'Group F',
            cols: 1,
            rows: 1,
        }];
    return (
        <div>
            <div className="max-w-6xl mx-auto font-tahoma p-12">

                <div className="grid grid-cols-4 mt-12">
                    <button onClick={onAllocateRandomly}
                        className="bg-mustard hover:bg-bear text-black font-bold py-2 flex-1">Allocate randomly
                    </button>
                </div>
                <div className="grid grid-cols-4">
                    <div className="mt-12 col-span-3 gap-2">
                        <MultipleTablesComponent columns={3} colMargin={20} grids={tables}> </MultipleTablesComponent>
                    </div>
                    <div className=" mt-12 ml-12">
                        <p className="font-bold mb-4">Teams</p>
                        <ListBox
                            data={teams}
                            textField="name"
                            style={{width: "100%", height: "97%"}}
                            // onDragStart={handleDragStart}
                            // onDrop={handleDrop}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-12">
                    <button className="bg-mustard hover:bg-bear text-black font-bold py-2 col-start-3">Save & Close
                    </button>
                    <button className="bg-mustard hover:bg-bear text-black font-bold py-2 col-start-4">Close
                    </button>
                </div>
            </div>
        </div>
    )

}

export default AllocateTeams;
