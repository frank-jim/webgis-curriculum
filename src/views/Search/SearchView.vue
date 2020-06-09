<template>
    <div id="searchView">
        <SearchBar @SearchInfo="getSearchInfo" ></SearchBar>
        <SearchInfo v-if="showInfo" :id="featureid" ref="info"></SearchInfo>
        <UpdateInfo></UpdateInfo>
    </div>
</template>

<script>
    import SearchBar from "../../components/Search/SearchBar";
    import SearchInfo from "../../components/Search/SearchInfo";
    import UpdateInfo from "../../components/Search/UpdateInfo";
    export default {
        name: "SearchView",
        components:{
            UpdateInfo,
            SearchInfo,
            SearchBar
        },
        data(){
            return{
                featureid:0,
                showInfo:false
            }
        },
        methods:{
            getSearchInfo(item){
                //发送详细信息的搜索
                this.featureid = parseInt(item.id);
                console.log("View ++ item"+"++++++++++++"+this.featureid);
                if (this.showInfo){
                    this.$refs['info'].changeInfo();
                }
                else {
                    this.showInfo = true;
                }
            }
        }
    }
</script>

<style scoped>
#searchView{
    float: left;
    margin-left: 100px;
    margin-top: 50px;
    z-index: 2;
    position: fixed;
}

</style>