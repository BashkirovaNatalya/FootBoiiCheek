import * as React from "react";
import * as PropTypes from "prop-types";
import {FORM_CONTROL_TYPE} from "../../utils/constants";
import {DatePicker} from "@progress/kendo-react-dateinputs";
import {Checkbox, Input, NumericTextBox} from "@progress/kendo-react-inputs";
import { DropDownList} from "@progress/kendo-react-dropdowns";

class FormEditorComponent extends React.Component {

    constructor(props) {
        super(props);
        this.onDataChangeHandle = this.onDataChangeHandle.bind(this);


    }

    componentDidMount() {
        const obj = {};
        if (this.props.model) {
            this.props.model.forEach(prop=>{
                if(prop.available)
                    obj[prop.name] = null;
            })
        }
        this.setState({...obj})
    }

    state = {
        dataItem: this.props.dataItem ?? {},
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

    /**
     * Получение контрола по описанию.
     * @param {string} name - название свойства модели.
     * @param {string} type - тип контрола, для назначения использовать FORM_CONTROL_TYPE.
     * @param {Array} available - массив допустимых значений.
     * @param {string} label - отображаемое название.
     */

    resolveControl(name, type, available= null, label = null) {
        if (!!available?.length && type !== FORM_CONTROL_TYPE.OBJECT) {
            return (<DropDownList key={name + type} label={label}
                                  style={this.baseControlStyle} value={this.state?.dataItem?.[name]} data={available}
                                  onChange={(e) => this.onDataChangeHandle({...e, name})}>
            </DropDownList>)
        }
        switch (type) {
            case FORM_CONTROL_TYPE.DATE:
                if(typeof this.state?.dataItem?.[name] === 'string') {
                    this.setState({
                        dataItem: {...this.state.dataItem, [name]: new Date(this.state?.dataItem?.[name]) }
                    })
                }else {
                    if (this.state?.dataItem?.[name] == null) {
                        this.setState({
                            dataItem: {...this.state.dataItem, [name]: new Date() }
                        })
                    }
                }

                return (<DatePicker key={name+type} label={label} style={this.baseControlStyle} name={name} value={this.state?.dataItem?.[name]} onChange={
                    (e)=>this.onDataChangeHandle({...e, name})}></DatePicker>);
            case FORM_CONTROL_TYPE.NUMBER:
                return (<div style={{...this.baseControlStyle, display:'Contents'}}><NumericTextBox className='w-full' key={name+type} label={label} name={name} value={this.state?.dataItem?.[name]} onChange={  (e)=>this.onDataChangeHandle({...e, name})}></NumericTextBox></div>);
            case FORM_CONTROL_TYPE.STRING:
                return (<Input  key={name+type} label={label} style={this.baseControlStyle} name={name} value={this.state?.dataItem?.[name]} onChange={  (e)=>this.onDataChangeHandle({...e, name})}></Input>);
            case FORM_CONTROL_TYPE.BOOL:
                return (<Checkbox key={name+type} style={this.baseControlStyle} label={label} name={name} value={this.state?.dataItem?.[name]} onChange={  (e)=>this.onDataChangeHandle({...e, name})}></Checkbox>);
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

    /** При желании переопрделить, наследуете компонент и там играйтесь */
    render() {
        return(<div style={{display:"flex", flexDirection:"column", height:'fit-content', padding:'10px'}}>
            {this.props.model.map((prop)=>{
                return this.resolveControl(prop.name, prop.type, prop.available, prop.label);
            })}
        </div>);
    }
}

export default FormEditorComponent;
