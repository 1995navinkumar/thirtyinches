import React from 'react';
import styled from 'styled-components';
import { addSubscription } from '../../utils/api-util.js';
import { useNavigate } from 'react-router';
import { AppContext } from '../../context';
import { parseXLS } from '../../utils/file-util';

var Styles = styled.div`
    .add-subscriber-form input, .add-subscriber-form textarea {
        margin : 8px 0px;
        min-height : 32px;
        border-radius : 44px;
        padding : 8px;
    }

    .add-subscriber--btn {
        width : 144px;
        height : 44px;
        border-radius : 44px;
        background : #EE6211;
        border : 1px solid #FFF202;
        color : #FFFFFF;
    }
`

export default function AddSubscribers() {
    var { orgs } = React.useContext(AppContext);
    var navigate = useNavigate();
    var formRef = React.useRef();

    var fileRef = React.useRef();


    var subDetails = React.useCallback(() => {
        var formEls = Array.from(formRef.current.children);
        formEls.pop();

        var details = formEls.map(f => ({ value: f.value, name: f.name }));
        var subscriberDetails = arrayToObj(details.slice(0, 4));
        var subscriptionDetails = arrayToObj(details.slice(4));

        subscriberDetails.orgId = getSelectedOrgAndBranch(orgs);

        addSubscription(subscriberDetails, subscriptionDetails)
            .then(() => {
                navigate("/subscriptions/list");
            })

    }, []);

    function readXls(e) {
        var file = fileRef.current.files[0];
        parseXLS(file)
            .then(console.log)
            .catch(console.log)
    }

    return (
        <Styles className="flex-column flex-align-center">
            {/* <div>Sub add</div> */}

            {/* <input type="file" id="imageFile" capture="camera" accept="image/*"/> */}

            {/* <input type="file" ref={fileRef} onChange={readXls} /> */}

            <div ref={formRef} className="add-subscriber-form flex-column flex-align-center">
                <input type="text" placeholder="name" name="name" />
                <input type="date" name="dob" placeholder="D.O.B" />
                <textarea name="address" placeholder="Address" />
                <input type="tel" name="contact" placeholder="contact number" pattern="[0-9]{10}" />

                <input type="date" name="subscribe from" placeholder="start from" />
                <input type="number" name="duration" placeholder="No.of months" />
                <input type="number" name="amount paid" placeholder="amount paid" />
                <button onClick={subDetails} className="add-subscriber--btn">Add</button>
            </div>
        </Styles>
    )
}

function arrayToObj(arr) {
    return arr.reduce((acc, det) => {
        acc[det.name] = det.value;
        return acc;
    }, {});
}

function getSelectedOrgAndBranch(orgs) {
    return orgs[0].id;
}