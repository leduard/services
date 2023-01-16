interface ReferenceTable {
    Codigo: number;
    Mes: string;
}

interface FipeVehicleBrand {
    Label: string;
    Value: string;
}

interface FipeVehicleModels {
    Modelos: {
        /** ("Lancer GT 2.0 16V 160cv Aut.") */
        Label: string;
        Value: string;
    }[];
    Anos: {
        /** ("2017 Gasolina") */
        Label: string;
        /** ("2017-1") */
        Value: string;
    }[];
}

interface FipeVehicleModelYear {
    /** ("2018 Gasolina") */
    Label: string;
    /** ("2018-1") */
    Value: string;
}

interface FipeVehicleData {
    Valor: string;
    Marca: string;
    Modelo: string;
    AnoModelo: number;
    Combustivel: string;
    CodigoFipe: string;
    MesReferencia: string;
    Autenticacao: string;
    TipoVeiculo: number;
    SiglaCombustivel: string;
    DataConsulta: string;
}
