import {Button, buttonVariants} from "@/components/ui/button.tsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import pb from "@/lib/pocketbase.ts";
import {FeedFormulation} from "@/pages/dashboard/feed-formulation/columns.tsx";
import {useQuery} from "@tanstack/react-query";
import {FormulaIngredient} from "@/pages/dashboard/feed-formulation/ingredients/add.tsx";
import {Icon} from "@iconify/react";

export default function FeedFormulaIngredientsList() {
    const params = useParams();
    const navigate = useNavigate();


    const {data: formula} = useQuery({
        queryKey: ['feedFormulas', params.formulaId],
        queryFn: () => pb.collection('feedFormulas').getOne<FeedFormulation>(params.formulaId || '').then((record) => record).then(r => r)
    })

    const {data: formulaIngredients} = useQuery({
        queryKey: ['formulaIngredients', params.formulaId],
        queryFn: () =>
            pb.collection('formulaIngredients').getFullList<FormulaIngredient>({
                sort: '-created',
                expand: 'feedId',
                filter: `formulaId="${params.formulaId}"`,
            }).then(r => r)
    })


    return <>
        <div>
            <div className={'flex items-center justify-between'}>
                <Button onClick={() => navigate(-1)} size={'icon'} variant={'outline'}>
                    <Icon icon={'lucide:arrow-left'} className={'h-5 w-5'}/>
                </Button>
                <h1 className={'font-bold text-xl md:text-3xl'}>{formula?.formulaName} - Ingredients</h1>
                <div>
                    <Link className={buttonVariants({size: 'sm', variant: 'default'})}
                          to={`/dashboard/feed-formulation/${params.formulaId}/ingredients/+`}>
                        <span>Add Ingredient</span>
                    </Link>
                </div>
            </div>
            <div className={'py-4 flex flex-col gap-2'}>
                {
                    formulaIngredients?.map((ingredient) => <FormulaIngredientCard key={ingredient.id}
                                                                                   ingredient={ingredient}/>)
                }
            </div>
        </div>
    </>

}


function FormulaIngredientCard({ingredient}: { ingredient: FormulaIngredient }) {
    return <div>
        <div
            className={'group flex items-start justify-between bg-white border-2 p-3 pl-4 rounded-2xl cursor-pointer hover:bg-gray-50'}>
            <div>
                <p className={'text-xl'}><b>{ingredient.percentage}</b>% of <span
                    className={'font-bold'}>{ingredient.expand.feedId.feedName}</span></p>
            </div>
            <div className={'flex gap-2'}>
                <Link className={buttonVariants({size: 'icon', variant: 'ghost'})}
                      to={`/dashboard/feed-formulation/${ingredient.formulaId}/ingredients/${ingredient.id}`}>
                    <Icon icon={'eva:edit-fill'} className="h-5 w-5"/>
                </Link>
                <Link className={buttonVariants({size: 'icon', variant: 'ghost'})}
                      to={`/dashboard/feed-formulation/${ingredient.formulaId}/ingredients/${ingredient.id}`}>
                    <Icon icon={'eva:trash-2-fill'} className="h-5 w-5 text-red-500"/>
                </Link>
            </div>
        </div>
    </div>
}