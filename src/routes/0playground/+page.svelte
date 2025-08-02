<div class="max-w-screen w-screen max-h-screen h-screen">
    <div class="absolute border-4 border-amber-300 h-screen w-[30px] z-30 "></div>
    <div class="flex flex-row bg-black overflow-y-scroll -z-100 ">
        <div class="h-screen w-[30px] z-30 " style="flex-basis: 30px"></div> 
        <div class="h-screen flex-grow relative flex">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[2000px] h-[200px] bg-green-500 border z-10"></div>
            <div class="w-[32px] h-[3000px] bg-blue-500 border z-20"></div>
        </div>
    </div>
</div> 




<!-- 

<div class="screen">
    <div class="sidebar_content"></div>
    <div class="container">
        <div class="sidebar"></div>
        <div class="scrollable">
            <div class="absolute-box"></div>
            <div class="tall-box"></div>
        </div>
    </div>
</div>


<style>
    .sidebar_content {
        position: absolute;
        border: 4px solid yellow;
        height: 100vh;
        width: 30px;
        z-index: 10;
    }
    .screen {
        width: 100vw;
        height: 100vh;
    }
    .container {
        /* height: 100%; */
        min-width: 100%;
        display: flex;
        background-color: red;
        flex-direction: row;
        overflow-y: scroll;
    }

    .sidebar {
      height: 100%;
      flex-basis: 30px;
      border: 1px solid black;
      z-index: 10;
    }

    .scrollable {
        max-height: 100%;
        display: flex;
        justify-content: center;
        flex-grow: 1;
        position: relative;
    }

    .absolute-box {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 2000px;
        height: 200px;
        background-color: green;
        border: 1px solid;
    }

    .tall-box {
        z-index: 20;
        width: 32px;
        height: 2000px;
        background-color: blue;
        border: 1px solid;
    }
</style>













 -->





<!-- 
<div class="screen">
    <div class="container">
        <div class="h-screen w-[30px] z-30 " style="flex-basis: 30px"></div> 
        <div class="h-screen flex-grow relative flex">
            <div class="wide"> </div>
            <div class="long"></div>
        </div>
    </div>
</div>

<style>
    .screen {
        height: 100vh;
        width: 100vw;
    }
    .container {
        min-width: 100%;
        display: flex;
        flex-direction: row;
        overflow-y: scroll;
    }
    .wide {
        background-color: green;
        height: 200px;
        width: 2000px;
        position: absolute;
        border: 2px solid;
        translate: -50% 0;
        top: 0;
        left: 50%;
        z-index: -10;
    }
    .long {
        background-color: blue;
        height: 2000px;
        width: 16px;
    }
</style> -->
