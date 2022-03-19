import React from 'react';
import {DropDownList} from "@progress/kendo-react-dropdowns";
import * as PropTypes from "prop-types";
import {FORM_CONTROL_TYPE} from "../../shared/utils/constants";
import {DatePicker} from "@progress/kendo-react-dateinputs";
import {Checkbox, Input, NumericTextBox} from "@progress/kendo-react-inputs";
import {$host} from "../../api";
import EditableGridTableComponent from "../../shared/components/editable-grid-table";
import {getTeamPLayers} from "../../api/teams_api";

class TeamCustomEditorForm extends React.Component {

    constructor(props) {
        super(props);
        this.onDataChangeHandle = this.onDataChangeHandle.bind(this);
    }
    async componentDidMount() {
        const obj = {};
        if (this.props.model) {
            this.props.model.forEach(prop=>{
                if(prop.available)
                    obj[prop.name] = null;
            })
        }
        this.setState({...obj})
        obj.name = this.state?.team.name
        obj.flag = this.state?.team.flag
        obj.countryCode = this.state?.team.countryCode

        const players = await getTeamPLayers(obj['id'])
    }


    static propTypes = {
        /** Реакция родительского элемента на изменения */
        onDataChange: PropTypes.func,
        /** Модель данных, формат - массив объектов {name:string, type:{@link FORM_CONTROL_TYPE}, available:Array, label:string} */
        model: PropTypes.any,
        /** Объект открываемый для редактирования */
        dataItem: PropTypes.object,
    }

    static defaultProps = {
        onDataChange: null,
        dataItem: {},
        model: [],
    }

    baseControlStyle = {width: '600px', }

    resolveControl(name, type, available= null, label = null) {
        if (!!available?.length && type !== FORM_CONTROL_TYPE.OBJECT) {
            return (<DropDownList key={name+type} label={label}
                                  style={this.baseControlStyle} value={this.state?.dataItem[name]} data={available}
                                  onChange={  (e)=>this.onDataChangeHandle({...e, name})}>
            </DropDownList>)
        }
        switch (type) {
            case FORM_CONTROL_TYPE.DATE:
                if(typeof this.state?.team?.[name] === 'string') {
                    this.setState({
                        dataItem: {...this.state.dataItem, [name]: new Date(this.state?.team?.[name]) }
                    })
                }else {
                    if (this.state?.team?.[name] == null) {
                        this.setState({
                            dataItem: {...this.state.dataItem, [name]: new Date() }
                        })
                    }
                }

                return (<DatePicker key={name+type} label={label} style={this.baseControlStyle} name={name} value={this.state?.team?.[name]} onChange={
                    (e)=>this.onDataChangeHandle({...e, name})}/>);
            case FORM_CONTROL_TYPE.NUMBER:
                return (<div style={{...this.baseControlStyle, display:'Contents'}}>
                    <NumericTextBox
                        className='w-full'
                        key={name+type}
                        label={label}
                        name={name}
                        value={this.state?.team?.[name]}
                        onChange={  (e)=>this.onDataChangeHandle({...e, name})}/>
                </div>);
            case FORM_CONTROL_TYPE.STRING:
                return (
                    <Input
                        key={name+type}
                        label={label}
                        style={this.baseControlStyle}
                        name={name}
                        value={this.state?.team?.[name]}
                        onChange={  (e)=>this.onDataChangeHandle({...e, name})}/>
                );
            case FORM_CONTROL_TYPE.BOOL:
                return (
                    <Checkbox
                        key={name+type}
                        style={this.baseControlStyle}
                        label={label}
                        name={name}
                        value={this.state?.team?.[name]}
                        onChange={(e)=>this.onDataChangeHandle({...e, name})}/>);
            case FORM_CONTROL_TYPE.OBJECT:
                if (!available || !available?.length){
                    throw new DOMException('Для контрола типа object необходим перечень допустимых объектов.', 'Ошибка в регистрации контрола')
                }
                return (<DropDownList textField="name" dataItemKey="id" key={name+type} label={label}
                                      style={this.baseControlStyle} value={this.state[name]} data={available}
                                      onChange={  (e)=>this.onDataChangeHandle({...e, name})}>
                </DropDownList>)
        }
    }

    /** Событие на изменение dataItem, вызывается после onChangeEvent любого контрола */
    onDataChangeHandle(e) {
        if(this.props.onDataChange) {
            this.setState({[e.name]: e.value})
            this.props.onDataChange(e);
        }
    }

    render() {
        return (
            <div className="space-y-5" style={{display:"flex", flexDirection:"column", height:'fit-content', padding:'10px'}}>
                {this.props.model.map((prop)=>{
                    return this.resolveControl(prop.name, prop.type, prop.available, prop.label);
                })}
                {/*<div>*/}
                {/*    <EditableGridTableComponent*/}
                {/*        columns={[*/}
                {/*            {field: 'number', title: 'Номер'},*/}
                {/*            {field: 'name', title: 'Имя'},*/}
                {/*            {field: 'position', title: 'Позиция'}*/}
                {/*        ]}*/}
                {/*        dataSource={this.state.players}*/}
                {/*        sourceUrl={$host.defaults.baseURL+'/api/teams/'}*/}
                {/*        editorForm={TeamCustomEditorForm}*/}
                {/*        model={*/}
                {/*            [*/}
                {/*                {name: 'firstName', type: FORM_CONTROL_TYPE.STRING, available:[], label: 'Имя'},*/}
                {/*                {name: 'lastname', type: FORM_CONTROL_TYPE.STRING, available: [], label: 'Фамилия'},*/}
                {/*                {name: 'number', type: FORM_CONTROL_TYPE.STRING, available: [], label: 'Номер'},*/}
                {/*                {name: 'birthDay', type: FORM_CONTROL_TYPE.DATE, available: [], label: 'Дата рождения'},*/}
                {/*                {name: 'position', type: FORM_CONTROL_TYPE.STRING, available: [], label: 'Позиция'},*/}
                {/*            ]*/}
                {/*        }/>*/}
                {/*</div>*/}
            </div>
        )
    }
};

export default TeamCustomEditorForm;
