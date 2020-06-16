<template>
    <div id="list">
        <li class="flex header">
            <h2 v-for="label in labels" :key="label"> {{ label }}</h2>
        </li>
        <hr>
        <template v-for="row in data">
            <hr :key="row.id">
            <li class="flex" :key="row.id">
                <h3 v-for="cell in row" :key="cell"> {{ Array.isArray(cell) ? cell.join(', ') : cell }} </h3>
            </li>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        labels: Array,
        data: Array,
    },
}

</script>

<style lang="postcss" scoped>
.flex {
    display: flex;
    padding: 0 1vw;
}
h3 {
    font-weight: 400;
    font-size: 16px;
    flex: 1;
    margin: 1.5vh 0;
}
h2 {
    font-size: 14px;
    font-weight: 600;
    flex: 1;
    margin: 1.5vh 0;
}
hr {
    margin-top: 0;
    margin-bottom: 0;
    border: solid 0.05vh rgba(255, 255, 255, 0.1);
}
</style>