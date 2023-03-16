Zeev.Controller = {
    MapDataSources: () => {
        Zeev.Integration.Functions.AddDataSource("GetCepData",
            {
                name: 'P00X - Get CEP Data',
                Dev: 'https://viacep-d.com.br/ws/{params}/json/',
                Hml: 'https://viacep-h.com.br/ws/{params}/json/',
                Prd: 'https://viacep.com.br/ws/{params}/json/'
            });
    },
    MapFields: () => {
        Zeev.Form.Functions.AddGrouping('Nome Agrupamento Zeev', 'IdParaAgrupamento');
        Zeev.Form.Functions.Tables.MapTableMult('idDaTabelaMultiValorada', 'NomeDaTabelaMultiValorada');
    },
    CustomerRules: {
        CheckDateNotPass: () => { }
    },
    Events: {
        OnChangeCampo1: () => { },
        OnChangeCampo2: () => { },
        OnBlurCampo3: () => {
            if (!Zeev.System.Functions.IsNullOrEmptySpace(this.value))
                Zeev.System.Functions.WriteLogConsole('Evento onBlur disparado!');
        }
    },

    Init: () => {
        Zeev.Resources.Functions.MapNativeResources();
        Zeev.Controller.MapDataSources();
        Zeev.Controller.MapFields();

        Zeev.Form.Fields.IdParaAgrupamento.Campo3.OnBlur(Zeev.Controller.Events.OnBlurCampo3).TriggerChange();
    }
}

document.addEventListener("DOMContentLoaded", function (e) {
    setTimeout(() => {
        Zeev.Controller.Init();
    }, Zeev.Integration.Settings.TimeOut);
});
/*v 1.0*/