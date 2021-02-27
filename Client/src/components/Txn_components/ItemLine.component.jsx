import React  from 'react';

const ItemLineComponent = (props) => 
{
    
    let item = props.item;
    const lineStyle={
        cursor: "pointer"
    };
    
    const discLineStyle={
        cursor: "pointer",
        color: "#0c0"
    };
    const rightAlign={
        textAlign: "right"
    };
    
    let render = [];

    render.push ( 
        <div key={item.lineNumber} style={lineStyle} className="row" >
            <div className="col-5"> {item.itemName} </div>
            <div className="col-1"> {item.itemQty} </div>
            <div className="col-1"> x </div>
            <div className="col-2"  style={rightAlign}> {item.itemPrice} </div>
            <div  className="col-3" style={rightAlign}> {item.itemTotalPrice} </div>
            
        </div>
    );
    
    if(item.discount && item.discount.discID )
    {
        render.push ( 
            <div key={item.discount.discID} style={discLineStyle} className="row" >
                <div className="col-8"> {item.discount.discDesc} </div>
                <div className="col-4" style={rightAlign}> {item.discount.discount} </div>
            </div> 
        );
    }

    return render;
}

export default ItemLineComponent;

/*

<div className="col-1 btn btn-success"
                onClick={()=>self.changeQty(item,true)} > 
                +
            </div>
            <div className="col-1 btn btn-info"
                onClick={()=>self.changeQty(item,false)} > 
                - 
            </div>
            <div onClick={()=>self.deleteItem(item)} 
                className="col-1 btn btn-danger"> 
                x
            </div>
*/
