import { collection, query, where, getDocs, arrayUnion, addDoc, getFirestore, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import * as fdb from 'firebase/firestore';
import { getAuth } from "firebase/auth";

window.fdb = fdb;

export async function addOrgDetails(details) {
    var user = getAuth().currentUser;
    const db = getFirestore();

    var [orgName, branchName, branchAddress, contact] = details;

    try {
        const orgDocRef = await addDoc(collection(db, "orgs"), {
            userId: user.uid,
            name: orgName,
            branches: arrayUnion({
                name: branchName,
                address: branchAddress,
                contact
            })
        });
        return orgDocRef;

    } catch (er) {
        console.log(er);
        return false;
    }

}

export async function getOrgDetails() {
    var user = getAuth().currentUser;
    const db = getFirestore();

    window.db = db;

    const q = query(collection(db, "orgs"), where("userId", "==", user.uid));
    return getDocs(q)
        .then(snapshot => {
            return !snapshot.empty ? snapshot.docs.map(d => ({ id: d.id, ...d.data() })) : [];
        })
        .catch(er => { throw er });
}

export async function deleteOrg(org) {
    const db = getFirestore();
    return deleteDoc(
        doc(db, "orgs", org.id)
    )
        .then(() => {
            var q = query(collection(db, "branches"), where("orgId", "==", org.id));
            getDocs(q).then(sn => {
                sn.forEach(d => deleteDoc(d.ref));
            })
        })
        .catch(console.log)
}

export function subscribeToOrgs(setOrgs) {
    var db = getFirestore();
    var q = query(collection(db, "orgs"));

    return onSnapshot(q, (snapshot) => {
        var orgs = [];
        snapshot.forEach(d =>
            orgs.push({
                ...d.data(),
                id: d.id
            })
        );
        setOrgs(orgs);
    })
}