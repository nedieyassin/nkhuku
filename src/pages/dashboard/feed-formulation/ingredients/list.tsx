import {Button, buttonVariants} from "@/components/ui/button.tsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import pb from "@/lib/pocketbase.ts";
import {FeedFormulation} from "@/pages/dashboard/feed-formulation/columns.tsx";
import {useQuery} from "@tanstack/react-query";
import {FormulaIngredient} from "@/pages/dashboard/feed-formulation/ingredients/add.tsx";
import {Icon} from "@iconify/react";
import {useDialog} from "react-dialog-promise";
import AlertDialogComp from "@/components/dialog/AlertDialogComp.tsx";


export default function FeedFormulaIngredientsList() {
    const params = useParams();
    const navigate = useNavigate();
    const alertDialog = useDialog(AlertDialogComp);


    const {data: formula} = useQuery({
        queryKey: ['feedFormulas', params.formulaId],
        queryFn: () => pb.collection('feedFormulas').getOne<FeedFormulation>(params.formulaId || '').then((record) => record).then(r => r)
    })

    const {data: formulaIngredients, isLoading, isFetching, refetch} = useQuery({
        queryKey: ['formulaIngredients', params.formulaId],
        queryFn: () =>
            pb.collection('formulaIngredients').getFullList<FormulaIngredient>({
                sort: '-percentage',
                expand: 'feedId',
                filter: `formulaId="${params.formulaId}"`,
            }).then(r => r)
    })

    const handleDelete = (id: string) => {
        alertDialog.open({
            title: 'Are you sure you want to delete this?',
            description: 'All related data will be deleted. This action cannot be undone.'
        }).then((res) => {
            if (res) {
                pb.collection('formulaIngredients').delete(id).then(() => {
                    refetch();
                })
            }
        })
    }


    return <>
        <div>
            <div className={'flex items-center justify-between gap-2'}>
                <div className={'flex items-center gap-2'}>
                    <Button className={'shrink-0'} onClick={() => navigate(-1)} size={'icon'} variant={'outline'}>
                        <Icon icon={'lucide:arrow-left'} className={'h-5 w-5'}/>
                    </Button>
                    <h1 className={'font-bold text-xl md:text-3xl line-clamp-1 w-full'}>{formula?.formulaName} -
                        Ingredients</h1>
                </div>
                <div>
                    <Link className={buttonVariants({size: 'sm', variant: 'default'})}
                          to={`/dashboard/feed-formulation/${params.formulaId}/ingredients/+`}>
                        <span>Add Ingredient</span>
                    </Link>
                </div>
            </div>
            <div className={'pt-4 pb-2 flex items-center justify-between'}>
                <h1 className={'text-lg'}>Composition (<span
                    className={'font-bold'}>{formulaIngredients?.reduce((a, b) => a + b.percentage, 0) || 0}</span> /
                    100)</h1>
                <Button onClick={() => refetch()} variant={'outline'} size={'icon'}>
                    <Icon icon={'lucide:refresh-cw'}
                          className={`h-4 w-4 ${isLoading || isFetching ? 'animate-spin' : ''}`}/>
                </Button>
            </div>
            <div className={'flex flex-col gap-2'}>
                {

                    isLoading || isFetching ?
                        <div className={'space-y-2'}>
                            <FormulaIngredientCardSkeleton/>
                            <FormulaIngredientCardSkeleton/>
                            <FormulaIngredientCardSkeleton/>
                        </div>
                        : formulaIngredients?.map((ingredient) =>
                            <FormulaIngredientCard key={ingredient.id}
                                                   handleDelete={handleDelete}
                                                   ingredient={ingredient}/>)
                }
                {isLoading || isFetching ? null : formulaIngredients?.length ? null :
                    <div className={'flex justify-center items-center flex-col gap-2 py-20'}>
                        <p className={'text-gray-500 text-sm'}>No ingredients found</p>
                        <Link className={buttonVariants({size: 'sm', variant: 'default'})}
                              to={`/dashboard/feed-formulation/${params.formulaId}/ingredients/+`}>
                            <span>Add Ingredient</span>
                        </Link>
                    </div>}
            </div>
        </div>
    </>

}


function FormulaIngredientCardSkeleton() {
    return <div className={'bg-gray-200 h-16 w-full rounded-md animate-pulse'}></div>
}

function FormulaIngredientCard({ingredient, handleDelete}: {
    ingredient: FormulaIngredient,
    handleDelete: (id: string) => void,
}) {
    return <div>
        <div
            className={'group flex items-start justify-between bg-white p-3 pl-4 border rounded-md cursor-pointer hover:bg-gray-50'}>
            <div>
                <p className={'text-xl'}><b>{ingredient.percentage || '-'}</b>% of <span
                    className={'font-bold'}>{ingredient.expand?.feedId?.feedName || '-'}</span></p>
            </div>
            <div className={'flex gap-2'}>
                <Link className={buttonVariants({size: 'icon', variant: 'ghost'})}
                      to={`/dashboard/feed-formulation/${ingredient.formulaId}/ingredients/${ingredient.id}`}>
                    <Icon icon={'eva:edit-fill'} className="h-5 w-5"/>
                </Link>
                <Button size={'icon'} variant={'ghost'} onClick={() => ingredient.id && handleDelete(ingredient.id)}>
                    <Icon icon={'eva:trash-2-fill'} className="h-5 w-5 text-red-500"/>
                </Button>
            </div>
        </div>
    </div>
}