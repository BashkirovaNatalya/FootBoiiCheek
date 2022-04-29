import React, {useEffect, useMemo, useState} from 'react';
import Table from "../components/table";
import EditableGridTableComponent from "../shared/components/editable-grid-table/editable-grid-table-component";
import {FORM_CONTROL_TYPE, TABLE_VIEW_MODE} from "../shared/utils/constants";
import {TabStripTab} from "@progress/kendo-react-layout";
import MultipleTablesComponent from "../shared/must-be-rework/multiple-tables-component";
import {ListBox, processListBoxDragAndDrop} from "@progress/kendo-react-listbox";
import {allocateRandomly, getAllGroupsInTournament} from '../api/participant-api'
import {getTeams} from "../api/teams_api";
import { ColumnDefaultProps } from '@progress/kendo-react-data-tools';

function AllocateTeams() {
    const tournamentId = 1;
    // const [draggedItem, setDraggedItem] = useState([]);
    const [teams, setTeams] = useState([]);
    const [tables, setTables] = useState([]);
    // const [allocatedRandomly, setAllocatedRandomly] = useState([]);
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
    // const optionsSample = [
    //     {
    //         id: 1,
    //         team: 'Belgium'
    //     },
    //     {
    //         id: 2,
    //         team: 'Germany'
    //     },
    //     {
    //         id: 3,
    //         team: 'England'
    //     },
    //     {
    //         id: 4,
    //         team: 'Iceland'
    //     },
    //     {
    //         id: 5,
    //         team: 'Italy'
    //     }];
    // const tableSample = [
    //     {
    //         ID: 0,
    //         shortname: 1,
    //         team: "RU"
    //     }];

    useEffect(async () => {
        const loadedTeams = await getTeams();
        //console.log(loadedTeams);
        // const loadedGroups = await getAllGroupsInTournament(tournamentId);
        setTeams(loadedTeams);
        setGroups(groupsSample);
        // setDraggedItem([]);
        setTables(tablesSample);
    }, [])

    const createAllocatedGroupsArray = (allocateRandomlyValue) => {
        const groupsAllocated = groups.map(data => {
            let groupArray = [] 
            for(let i in allocateRandomlyValue){
                if (allocateRandomlyValue[i].group == data.value){
                    groupArray.push(allocateRandomlyValue[i].id)
                }
            }

           return {
                [data.value]: groupArray
           }

        });
        console.log("groupsAllocated",groupsAllocated);
        console.log("groupsAllocated 0",groupsAllocated[0]);
        console.log("teams: ", teams);

        // console.log("mapping",groupsAllocated.map((x) => x));

       return  groupsAllocated.map((x, i) => ({
            component: (
                <EditableGridTableComponent key={x[groupsSample[i].value]}
                    mode={TABLE_VIEW_MODE.READ}
                    columns={columnsHeaders}
                    dataSource={[{
                        ID: x[groupsSample[i].value][0],
                        region: teams[x[groupsSample[i].value][0]-1].region,
                        team: teams[x[groupsSample[i].value][0]-1].name 
                    }, {
                        ID: x[groupsSample[i].value][1],
                        region: teams[x[groupsSample[i].value][1]-1].region,
                        team: teams[x[groupsSample[i].value][1]-1].name 
                    },
                    {
                        ID: x[groupsSample[i].value][2],
                        region: teams[x[groupsSample[i].value][2]-1].region,
                        team: teams[x[groupsSample[i].value][2]-1].name 
                    },
                    {
                        ID: x[groupsSample[i].value][3],
                        region: teams[x[groupsSample[i].value][3]-1].region,
                        team: teams[x[groupsSample[i].value][3]-1].name 
                    },
                ]}
                    >
                </EditableGridTableComponent>
            ),
            title: groupsSample[i].name,
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
        let allocateRandomlyValue = await allocateRandomly(tournamentId);
        console.log("allocateRandomlyResponse: ", allocateRandomlyValue);
        // setAllocatedRandomly(allocateRandomlyValue);
        const tableValues = createAllocatedGroupsArray(await allocateRandomly(tournamentId));
        setTables(tableValues);
    }

    const onAllocateRandomly = () => {
       void allocate();
    }


    console.log("table value: ", tables);

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
                    dataSource={
                        [{
                            ID: 1,
                            region: "a",
                            name: "k" 
                        }]
                    }>
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
