const handleDomo = (e) => { 
    e.preventDefault(); 

    $("#domoMessage").animate({width:'hide'}, 350); 

    if($("#domoName").val() == '' ||  $("#domoAge").val() == '' ||  $("#domoFavoriteColor").val() == '') { 
        handleError("RAWR! All fields are required"); 
        return false; 
    } 

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() { 
        loadDomosFromServer(); 
    }); 
    return false; 
}; 

const deleteDomo = (e) => { 
    e.preventDefault(); 

    $("#domoMessage").animate({width:'hide'}, 350); 

    sendAjax('POST', '/deleteDomo', `_csrf=${document.querySelector("#_csrfhidden").value}&domo_id=${e.target.getAttribute("data-domo-id")}`, function() { 
        loadDomosFromServer(); 
    });
    return false; 
}; 

    
const DomoForm = (props) => { 
    return (
    <form id="domoForm" 
            onSubmit={handleDomo} 
            name="domoForm" 
            action="/maker" 
            method="POST" 
            className="domoForm"> 

    <label htmlFor="name">Name: </label> 
    <input id="domoName" type="text" name="name" placeholder="Domo Name"/> 
    <label htmlFor="age">Age: </label> 
    <input id="domoAge" type="text" name="age" placeholder="Domo Age"/> 
    <label htmlFor="favoritecolor">Favorite Color: </label> 
    <input id="domoFavoriteColor" type="text" name="favoritecolor" placeholder="Domo Favorite Color"/> 
    <input type="hidden" name="_csrf" id="_csrfhidden" value={props.csrf} /> 
    <input className="makeDomoSubmit" type="submit" value="Make Domo" /> 
    </form>
    );
};

const DomoList = function(props) { 
    if(props.domos.length === 0) { 
        return (
        <div className="domotist"> 
            <h3 className="emptyDomo">No Domos yet</h3> 
        </div> 
        ); 
    }

    const domoNodes = props.domos.map(function(domo) { 
        return (
            <div key={domo._id} className="domo"> 
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" /> 
                <h3 className="domoName"> Name: {domo.name} </h3> 
                <h3 className="domoAge"> Age: {domo.age} </h3> 
                <h3 className="domoFavoriteColor"> Favorite Color: {domo.favoritecolor} </h3>
                <button className="deleteDomo" onClick={deleteDomo} type="button" data-domo-id={domo._id}>Delete</button> 
            </div> 
        ); 
    }); 

    return (
        <div className="domoList"> 
            { domoNodes } 
        </div> 
    ); 
}; 

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} />, document.querySelector("#domos")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <DomoForm csrf={csrf} domos={[]} />, document.querySelector("#domos")
    );

    loadDomosFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});