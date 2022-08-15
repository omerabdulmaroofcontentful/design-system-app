import React, { useState,useEffect } from 'react';
import { Paragraph,Table,Select } from '@contentful/f36-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';
import { KeyObject } from 'crypto';


interface DSValueInf { [key: string]: string }

const Field = () => {
  

  const sdk = useSDK<FieldExtensionSDK>();
  sdk.window.startAutoResizer()
  //const cma = useCMA()


  async function onValueChange(event:any,key: string){

    console.log('onValueChange',event,key,event.target.value)
    currentDSValue[key] = event.target.value
    setDSValue({...currentDSValue})
    let result = await sdk.field.setValue(currentDSValue)
    console.log('updated field',result)

  }


  // Declare a new state variable, which we'll call "count"
    const [designSystem, setDesignSystem] = useState({string:[]});
   // const [currenSavedDSValue,setCurrenSavedDSValue] = useState({});
    const [currentDSValue, setDSValue] = useState<DSValueInf>({});

    useEffect(() => {

      //console.log('entry',sdk.editor.editorInterface.sys.contentType.sys.id)
      const fetchData = async () => {
         //fetch design system values from API
          fetch("../json_response.json")
          .then(response => response.json())
          .then(data => {
            console.log('Success:', typeof data);
            let contentType = sdk.editor.editorInterface.sys.contentType.sys.id
            console.log('contentType',contentType)
            if(contentType==='componenthero'){
              setDesignSystem(data.component)
            }else{
              setDesignSystem(data.page)
            }

            
          })

          //get current value saved
          let currenSavedDSValue = await sdk.field.getValue()
          setDSValue({...currenSavedDSValue})
      }

      fetchData()
    },[]);

  
  return <>
    <Table>
      <Table.Body>
        {Object.entries(designSystem).map(([key, dsValuesArray]) => {
            return (
              <Table.Row>
                <Table.Cell>{key}</Table.Cell>
                <Table.Cell>{
                    <Select
                    id="optionSelect-controlled"
                    name="optionSelect-controlled"
                    value={ currentDSValue === undefined ? dsValuesArray[0] : currentDSValue[key] }
                    onChange=  {(event: any) => onValueChange(event,key)}
                    //onChange={onValueChange}
                    >
                      {
                        dsValuesArray.map((val:any)=>{
                          return (                          
                            <Select.Option key={key} value={val}>{val}</Select.Option>
                          )
                        })
                      }
                     </Select>
                  }</Table.Cell>
              </Table.Row>
            
            );
        })}
      </Table.Body>
    </Table>

    </>;
};

export default Field;
