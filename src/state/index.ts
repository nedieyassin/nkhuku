import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {RecordModel} from "pocketbase";

interface storeState {
    currentUser?: RecordModel
    setCurrentUser: (user: RecordModel | undefined) => void
}


const useStore = create(persist<storeState>((set) => ({
            currentUser: undefined,
            setCurrentUser: (user: RecordModel | undefined = undefined) => set({currentUser: user})
        }),
        {
            name: 'store',
        })
)

export default useStore