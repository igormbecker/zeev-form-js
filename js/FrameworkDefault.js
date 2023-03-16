var Zeev = {
    Resources: {
        Native: {
        },
        CustomVariables: {
            ActionClickButton: null,
            Environments: ['dev', 'hml', 'prd'],
            TimeOut: 200,
            CurrentFocus: null
        },
        Functions: {
            MapNativeResources: () => {
                Zeev.Resources.Native.MessageContainer = new Zeev.Form.Functions.CreateElementMapping('#containerMessages');
                Zeev.Resources.Native.ECMLibraries = new Zeev.Form.Functions.CreateElementMapping('#ContainerRelatedLibraries');
                Zeev.Resources.Native.Loader = new Zeev.Form.Functions.CreateElementMapping('.app-overlay');
                Zeev.Resources.Native.Task = new Zeev.Form.Functions.CreateElementMapping('#inpDsFlowElementAlias');
                Zeev.Resources.Native.CodFlowExecuteUID = new Zeev.Form.Functions.CreateElementMapping('#inpCodFlowExecuteUID');
                Zeev.Resources.Native.CodFlowExecuteTask = new Zeev.Form.Functions.CreateElementMapping('#inpCodFlowExecuteTask');
                Zeev.Resources.Native.CodFlowExecute = new Zeev.Form.Functions.CreateElementMapping('#inpCodFlowExecute');
                Zeev.Resources.Native.CodFlow = new Zeev.Form.Functions.CreateElementMapping('#inpCodFlow');
                Zeev.Resources.Native.ActorName = new Zeev.Form.Functions.CreateElementMapping('#inpDsActorName');
            }
        }
    },
    Form: {
        Fields: {},
        Tables: {},
        Buttons: {},
        Events: {},
        Functions: {
            CreateElementMapping: function (fldSelector) {
                try {
                    if (Zeev.Form.Functions.IsNodeList(document.querySelectorAll(fldSelector)) && document.querySelectorAll(fldSelector).length == 0)
                        return null;
                    else if (document.querySelectorAll(fldSelector).length > 1) {
                        this.element = document.querySelectorAll(fldSelector);
                    } else {
                        this.element = document.querySelector(fldSelector);
                        if (this.element == null) {
                            fldSelector = fldSelector + '-1';
                            this.element = document.querySelector(fldSelector);
                        }
                    }
                } catch (ex) {
                    cryo_alert('Houve um problema ao carregar o formulário, atualize a tela ou contate o administrador.');
                    Zeev.System.Functions.WriteLogConsole('Campo não encontrado ' + fldSelector, ex);
                    return;
                }

                this.originalDisplay = document.querySelector(fldSelector).tagName == 'TABLE' ? 'table' : document.querySelector(fldSelector).style.display;
                this.originalMandatory = "";

                this.DontShow = (cleanValues = false) => {
                    let _thisElement = this.element;

                    if (Zeev.Form.Functions.IsNodeList(this.element)) {

                        _thisElement.forEach((element) => {
                            element.style.display = 'none';
                        });

                        _thisElement = _thisElement[0];
                    }
                    else
                        _thisElement.style.display = 'none';

                    if (((_thisElement.tagName == 'INPUT') || (_thisElement.tagName == 'SELECT') || (_thisElement.tagName == 'TEXTAREA'))) {
                        let tr = _thisElement.closest('tr');

                        if (tr) {
                            tr.style.display = 'none';
                            this.DontRequire();
                        }

                        if (cleanValues)
                            this.CleanValue();

                    } else if (_thisElement.tagName == 'TABLE') {
                        let i = 0;
                        if (_thisElement.getAttribute("mult") == "S") {
                            if (cleanValues) {
                                //Apaga as linhas da tabela exceto a primeira.
                                Array.from(_thisElement.tBodies[0].rows).forEach(row => {
                                    if (i > 1) {
                                        if (row.querySelector('[id="btnDeleteRow"]'))
                                            execv2.form.multipletable.deleteRow(row.querySelector('[id="btnDeleteRow"]'));
                                        else
                                            DeleteRow(row.querySelector('.btn-delete-mv'));
                                    }
                                    i++;
                                });
                            }
                        }

                        if (cleanValues) {
                            //Apaga os valores dos campos dentro da tabela.
                            Array.from(_thisElement.tBodies[0].rows).forEach(row => {
                                let inputs = row.querySelectorAll('input');
                                let selects = row.querySelectorAll('select');
                                let textareas = row.querySelectorAll('textarea');
                                //Apaga os valores dos inputs
                                if (inputs.length > 0) {
                                    Array.from(inputs).forEach(obj => {
                                        let type = obj.getAttribute("type");
                                        let xtype = obj.getAttribute("xtype");
                                        if (type && type.toUpperCase() !== "BUTTON" && type.toUpperCase() !== "HIDDEN") {
                                            if (type.toUpperCase() == "TEXT")
                                                obj.value = '';
                                            if (type.toUpperCase() == "RADIO" || type.toUpperCase() == "CHECKBOX")
                                                obj.checked = false;
                                            if (xtype && xtype.toUpperCase() == "FILE") {
                                                let btnDelFile = row.querySelector("[title='Excluir']");
                                                if (btnDelFile)
                                                    btnDelFile.click();
                                            }
                                        }
                                    });
                                }
                                //Faz as regras para os selects
                                if (selects.length > 0) {
                                    Array.from(selects).forEach(obj => {
                                        obj.value = "";
                                    });
                                }
                                //Faz as regras para os textareas
                                if (textareas.length > 0) {
                                    Array.from(textareas).forEach(obj => {
                                        obj.value = "";
                                    });
                                }
                            });
                        }

                        this.DontRequire();
                    }
                    return this;
                };
                this.Reveal = () => {
                    let _thisElement = this.element;

                    if (Zeev.Form.Functions.IsNodeList(this.element)) {
                        _thisElement.forEach((element) => {
                            element.style.display = '';
                        });
                        _thisElement = _thisElement[0];
                    }
                    else if (!(_thisElement.getAttribute('xtype') === 'FILE')) {
                        _thisElement.style.display = '';
                    }

                    if (((_thisElement.tagName == 'INPUT') || (_thisElement.tagName == 'SELECT') || (_thisElement.tagName == 'TEXTAREA'))) {
                        let tr = _thisElement.closest('tr');
                        if (tr) tr.style.display = '';
                    }

                    this.Require();

                    return this;
                };
                this.DontRequire = () => {
                    if (Zeev.Form.Functions.IsNodeList(this.element)) {
                        this.element.forEach((element) => {
                            _removeRequire(element);
                        });
                    } else {
                        _removeRequire(this.element);
                    }

                    function _removeRequire(element) {
                        if (((element.tagName === 'INPUT') || (element.tagName === 'SELECT') || (element.tagName === 'TEXTAREA'))) {
                            element.setAttribute('required', 'N');
                            Zeev.Form.Functions.ZeevClosest(element, 'tr').classList.remove('execute-required');
                        } else if (element.tagName === 'TABLE' && element.getAttribute('mult') === 'S') {
                            const fields = element.querySelectorAll('input, select, textarea');
                            if (fields) {
                                fields.forEach(f => {
                                    f.setAttribute('required', 'N');
                                });
                            }
                        }
                    }

                    return this;
                };
                this.Require = () => {
                    if (Zeev.Form.Functions.IsNodeList(this.element)) {
                        this.element.forEach((element) => {
                            _setRequire(element);
                        });
                    } else {
                        _setRequire(this.element);
                    }

                    function _setRequire(element) {
                        if (((element.tagName === 'INPUT') || (element.tagName === 'SELECT') || (element.tagName === 'TEXTAREA'))) {
                            if (element.getAttribute('data-required') === 'true') {
                                element.setAttribute('required', 'S');
                                Zeev.Form.Functions.ZeevClosest(element, 'tr').classList.add('execute-required');
                            }
                        } else if (element.tagName === 'TABLE' && element.getAttribute('mult') === 'S') {
                            const fields = element.querySelectorAll('input, select, textarea');
                            if (fields) {
                                fields.forEach(f => {
                                    if (f.getAttribute('data-required') === 'true') f.setAttribute('required', 'S');
                                });
                            }
                        }
                    }

                    return this;
                };
                this.ReadOnly = () => {
                    if (Zeev.Form.Functions.IsNodeList(this.element)) {
                        this.element.forEach((element) => {
                            if ((element.type.toUpperCase() == 'RADIO') || (element.type.toUpperCase() == 'CHECKBOX')) {
                                let tr = Zeev.Form.Functions.ZeevClosest(element, 'tr');
                                tr.classList.add('readOnlyType');
                            }
                        });
                    }
                    if (((this.element.tagName == 'INPUT') || (this.element.tagName == 'TEXTAREA'))) {
                        this.element.readOnly = true;
                    }
                    if (this.element.tagName == 'SELECT') {
                        this.element.classList.add('readOnlyType');
                    }
                    return this;
                };
                this.ReadEdit = () => {
                    if (Zeev.Form.Functions.IsNodeList(this.element)) {
                        this.element.forEach((element) => {
                            if ((element.type.toUpperCase() == 'RADIO') || (element.type.toUpperCase() == 'CHECKBOX')) {
                                let tr = Zeev.Form.Functions.ZeevClosest(element, 'tr');
                                tr.classList.remove('readOnlyType');
                            }
                        });
                    }
                    if (((this.element.tagName == 'INPUT') || (this.element.tagName == 'TEXTAREA'))) {
                        this.element.readOnly = false;
                    }
                    if (this.element.tagName == 'SELECT') {
                        this.element.classList.remove('readOnlyType');
                    }
                    return this;
                };
                this.OnClick = (newClick) => {
                    if (!newClick)
                        return;
                    let oldClick = this.element.onclick;
                    let clickFunction = () => {
                        let result = newClick();
                        if (result)
                            result = oldClick();
                        return result;
                    }
                    this.element.onclick = clickFunction;
                };
                this.OnChange = (newFunction) => {
                    if (Zeev.Form.Functions.IsNodeList(this.element)) {
                        this.element.forEach((element) => {
                            element.onchange = newFunction;
                        });
                    } else {
                        this.element.onchange = newFunction;
                    }
                    return this;
                };
                this.OnBlur = (newFunction) => {
                    if (Zeev.Form.Functions.IsNodeList(this.element)) {
                        this.element.forEach((element) => {
                            element.onblur = newFunction;
                        });
                    } else {
                        this.element.onblur = newFunction;
                    }
                    return this;
                };
                this.TriggerChange = () => {
                    if (Zeev.Form.Functions.IsNodeList(this.element)) {
                        let chk = false;
                        this.element.forEach((element) => {
                            if (element.checked) {
                                chk = true;
                                element.dispatchEvent(new Event('change'));
                            }
                        });
                        if (!chk) this.element[0].dispatchEvent(new Event('change'));
                    } else {
                        this.element.dispatchEvent(new Event('change'));
                    }
                    return this;
                };
                this.SetValue = (value) => {
                    const element = this.element;

                    if (Zeev.Form.Functions.IsNodeList(element)) {
                        if ((
                            (element[0].type == 'checkbox' || element[0].getAttribute('xtype') == 'CHECKBOX')
                            ||
                            (element[0].type == 'radio')
                            ))
                        {
                            let cbx = "";
                            Array.from(element).forEach(el => {
                                if (el.value.toUpperCase() == value.toUpperCase())
                                    cbx = el;
                            });
                            if (cbx) {
                                if (cbx.checked) {
                                    cbx.checked = false;
                                } else {
                                    cbx.checked = true;
                                }
                            } else if (value == ""){
                                Array.from(element).forEach(el => {
                                    el.checked = false;
                                });
                            }
                        }
                    } else {
                        element.value = value;
                    }
                };
                this.GetValue = ((field) => {
                    let defaultGetValueFunction = () => { return field.element.value; };

                    if (field.element.type == 'select-one')
                        field.options = Array.from(field.element.options);
                    if (Zeev.Form.Functions.IsNodeList(field.element)) {
                        field.options = document.querySelectorAll(fldSelector);
                        if (field.element[0].type == 'checkbox' || field.element[0].getAttribute('xtype') == 'CHECKBOX')
                            defaultGetValueFunction = () => {
                                let values = [];
                                Array.from(field.options).filter((checkbox) => {
                                    values.push({ value: checkbox.value, checked: checkbox.checked, type: checkbox.type });
                                });
                                return values;
                            };
                        if (field.element[0].type == 'radio')
                            defaultGetValueFunction = () => {
                                let selected = document.querySelector(fldSelector + ':checked');
                                if (selected)
                                    return selected.value;
                                else
                                    return null;
                            };
                    }
                    return defaultGetValueFunction;
                })(this);
                this.GetDescription = () => {
                    let description = this.GetValue();
                    if (this.element.type == 'select-one')
                        description = this.element.options[this.element.selectedIndex].text
                    if (this.element.type == 'hidden' && this.element?.attributes['data-fieldformat']?.value == 'SELECT')
                        description = this.element.parentElement.querySelector('div').textContent;
                    return description
                };
                this.CleanValue = () => {
                    if (Zeev.Form.Functions.IsNodeList(this.element)) {
                        this.element.forEach((element) => {
                            if ((element.type.toUpperCase() == 'RADIO') || (element.type.toUpperCase() == 'CHECKBOX')) {
                                element.checked = false;
                            }
                        });
                    }
                    else if (this.element.getAttribute('xtype')) {
                        if ((this.element.getAttribute('xtype').toUpperCase() == 'FILE')) {
                            let btnDelFile = this.element.parentElement.querySelector("[title='Excluir']");
                            if (btnDelFile)
                                btnDelFile.click();
                        }
                    }
                    else if (((this.element.tagName == 'INPUT') || (this.element.tagName == 'SELECT') || (this.element.tagName == 'SELECT-ONE') || (this.element.tagName == 'TEXTAREA'))) {
                        let type = "";
                        if (Zeev.System.Functions.IsNullOrEmptySpace(this.element.getAttribute('type')) && Zeev.System.Functions.IsNullOrEmptySpace(this.element.attributes.xtype))
                            type = this.element.tagName;
                        else
                            type = this.element.getAttribute('type') ? this.element.getAttribute('type') : this.element.attributes.xtype.value;    
                        
                        if (type && type.toUpperCase() !== "BUTTON" && type.toUpperCase() !== "HIDDEN")
                            this.element.value = "";
                    }
                };
                this.Filter = (itensName = '') => {
                    let itens = [];
                    let itensFields = [];
                    let positionIni = 0;

                    if (itensName.trim().length > 0)
                        itens = itensName.split(',');

                    if (this.element.tagName == 'SELECT') {
                        positionIni = 1;
                        itensFields = this.element.options;
                    } else if (Zeev.Form.Functions.IsNodeList(this.element)) {
                        itensFields = this.element;
                    }

                    _hideOptionsAll(itensFields, positionIni);
                    _showOptionsFilter(itensFields, itens);

                    function _showOptionsFilter(itensFields, itensName) {
                        if (itensFields && itensName) {
                            if (itensName.length > 0) {
                                itensName.forEach(name => {
                                    for (let i = 0; i < itensFields.length; i++) {
                                        if (itensFields[i].value.toLocaleLowerCase() == name.toLocaleLowerCase()) {
                                            if (itensFields[i].getAttribute('type') == 'radio' || itensFields[i].getAttribute('type') == 'checkbox') {
                                                Zeev.Form.Functions.ZeevClosest(itensFields[i], 'div').style.display = 'block';
                                            } else {
                                                itensFields[i].style.display = 'block';
                                            }
                                        }
                                    }
                                });
                            } else {
                                for (let i = 0; i < itensFields.length; i++) {
                                    if (itensFields[i].getAttribute('type') == 'radio' || itensFields[i].getAttribute('type') == 'checkbox') {
                                        Zeev.Form.Functions.ZeevClosest(itensFields[i], 'div').style.display = 'block';
                                    } else {
                                        itensFields[i].style.display = 'block';
                                    }
                                }
                            }
                        }
                    }
                    function _hideOptionsAll(itensFields, positionIni) {
                        if (itensFields) {
                            for (let i = positionIni; i < itensFields.length; i++) {
                                if (itensFields[i].getAttribute('type') == 'radio' || itensFields[i].getAttribute('type') == 'checkbox') {
                                    Zeev.Form.Functions.ZeevClosest(itensFields[i], 'div').style.display = 'none';
                                } else {
                                    itensFields[i].style.display = 'none';
                                }
                            }
                        }
                    }
                };
                this.GetRows = () => {
                    return (this.element.tagName == 'TABLE' && this.element.getAttribute("mult") == "S") ? this.element.querySelectorAll('tr:not(.header)') : [];
                };
                this.ValidateCPF = () => {
                    var valid = true;

                    if (this.element.tagName === 'INPUT') {
                        var cpf = this.element.value.replace(/[^\d]+/g, '');

                        if (cpf == '') {
                            valid = false;
                        }
                        // Elimina CPFs invalidos conhecidos   
                        if (cpf.length !== 11 ||
                            cpf == "00000000000" ||
                            cpf == "11111111111" ||
                            cpf == "22222222222" ||
                            cpf == "33333333333" ||
                            cpf == "44444444444" ||
                            cpf == "55555555555" ||
                            cpf == "66666666666" ||
                            cpf == "77777777777" ||
                            cpf == "88888888888" ||
                            cpf == "99999999999") {
                            valid = false;
                        }

                        // Valida 1o digito   
                        add = 0;
                        for (i = 0; i < 9; i++)
                            add += parseInt(cpf.charAt(i)) * (10 - i);
                        rev = 11 - (add % 11);
                        if (rev == 10 || rev == 11)
                            rev = 0;
                        if (rev !== parseInt(cpf.charAt(9))) {
                            valid = false;
                        }

                        // Valida 2o digito   
                        add = 0;
                        for (i = 0; i < 10; i++)
                            add += parseInt(cpf.charAt(i)) * (11 - i);
                        rev = 11 - (add % 11);
                        if (rev == 10 || rev == 11)
                            rev = 0;

                        if (rev !== parseInt(cpf.charAt(10))) {
                            valid = false;
                        }

                        if (!valid) {
                            el.value = '';
                        }
                    }
                    return valid;
                };
                this.ValidateCNPJ = (cnpj) => {
                    var valid = true;

                    if (this.element.tagName === 'INPUT') {
                        cnpj = cnpj.replace(/[^\d]+/g, '');

                        if (cnpj == '') valid = false;

                        if (cnpj.length !== 14)
                            valid = false;

                        // Elimina CNPJs invalidos conhecidos
                        if (cnpj == "00000000000000" ||
                            cnpj == "11111111111111" ||
                            cnpj == "22222222222222" ||
                            cnpj == "33333333333333" ||
                            cnpj == "44444444444444" ||
                            cnpj == "55555555555555" ||
                            cnpj == "66666666666666" ||
                            cnpj == "77777777777777" ||
                            cnpj == "88888888888888" ||
                            cnpj == "99999999999999")
                            valid = false;

                        // Valida DVs
                        tamanho = cnpj.length - 2
                        numeros = cnpj.substring(0, tamanho);
                        digitos = cnpj.substring(tamanho);
                        soma = 0;
                        pos = tamanho - 7;
                        for (i = tamanho; i >= 1; i--) {
                            soma += numeros.charAt(tamanho - i) * pos--;
                            if (pos < 2)
                                pos = 9;
                        }
                        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                        if (resultado !== digitos.charAt(0))
                            valid = false;

                        tamanho = tamanho + 1;
                        numeros = cnpj.substring(0, tamanho);
                        soma = 0;
                        pos = tamanho - 7;
                        for (i = tamanho; i >= 1; i--) {
                            soma += numeros.charAt(tamanho - i) * pos--;
                            if (pos < 2)
                                pos = 9;
                        }
                        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                        if (resultado !== digitos.charAt(1))
                            valid = false;
                    }

                    return valid;
                }
            },
            IsNodeList: (nodes) => {
                let stringRepr = Object.prototype.toString.call(nodes);
                return typeof nodes === 'object' &&
                    /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
                    (typeof nodes.length === 'number') &&
                    (nodes.length === 0 || (typeof nodes[0] === "object" && nodes[0].nodeType > 0));
            },
            ZeevClosest: (obj, el) => {
                if (obj) {
                    if (obj.nodeName == el.toUpperCase())
                        return obj;
                    else
                        return obj.parentElement.closest(el);
                } else {
                    return null;
                }
            },
            ValidateEnvironment: (environment) => {
                if (!Zeev.Resources.CustomVariables.Environments.includes(environment))
                    cryo_alert(`Atenção, o ambiente <b>${environment}</b> configurado em script não foi encontrado, as integrações podem não funcionar corretamente !`);
            },
            HideAllGroupments: () => {
                Object.getOwnPropertyNames(Zeev.Form.Fields).forEach((groupName) => {
                    Zeev.Form.Functions.HideAllFields(Zeev.Form.Fields[groupName]);
                    Zeev.Form.Fields[groupName].DontShow();
                });
                if (Zeev.Form.Tables)
                    Object.getOwnPropertyNames(Zeev.Form.Tables).forEach((name) => {
                        if (Zeev.Form.Tables[name])
                            Zeev.Form.Tables[name].DontShow();
                    });
            },
            GetAllFields: () => {
                return Object.getOwnPropertyNames(Form.Fields.DadosSolicitante).filter((field) => {
                    if (!Form.CustomVariables.ValueException.includes(field))
                        return field;
                });
            },
            HideAllFields: (groupment, clean = false) => {
                Object.getOwnPropertyNames(groupment).filter((field) => {
                    if (field !== 'DontShow' && field !== 'Reveal' && field !== 'HideAllFields' && field !== 'ShowAllFields' && groupment[field].DontShow !== undefined)
                        groupment[field].DontShow(clean);
                });
            },
            CleanAllGroupments: (fieldException = null) => {
                Object.getOwnPropertyNames(Form.Fields).forEach((name) => {
                    Form.Functions.CleanAllFields(Form.Fields[name], fieldException);
                });
            },
            CleanAllFields: (groupment, fieldException = []) => {
                Object.getOwnPropertyNames(groupment).filter((field) => {
                    if (!Form.CustomVariables.ValueException.includes(field) && field && groupment[field].DontShow !== undefined && !fieldException.includes(groupment[field]))
                        groupment[field].CleanValue();
                });
            },
            CleanHideFields: (groupment, fieldException = []) => {
                Object.getOwnPropertyNames(groupment).filter((field) => {
                    if (!Form.CustomVariables.ValueException.includes(field) && field && groupment[field].DontShow !== undefined && !fieldException.includes(groupment[field]) && Form.Functions.VerifyHideField(groupment[field]))
                        groupment[field].CleanValue();
                });
            },
            VerifyHideField: (field) => {
                let result = false;
                if (Form.Functions.IsNodeList(field.element)) {
                    if (field.element[0].closest('tr').style.display == 'none')
                        result = true;
                } else if (field.element.closest('tr').style.display == 'none') {
                    result = true;
                }
                return result;
            },
            ShowAllFields: (groupment) => {
                Object.getOwnPropertyNames(groupment).filter((field) => {
                    if (field !== 'DontShow' && field !== 'Reveal' && field !== 'HideAllFields' && field !== 'ShowAllFields')
                        groupment[field].Reveal();
                });
            },
            AddGrouping: (groupmentId, groupmentName = undefined) => {
                if (!groupmentName)
                    groupmentName = groupmentId;

                groupmentName = groupmentName.toPropertyName();

                let groupElement = document.querySelector('table[id="' + groupmentId + '"');

                Zeev.Form.Fields[groupmentName] = {};

                if (groupElement) {
                    const fields = groupElement.querySelectorAll('input, select, textarea');

                    fields.forEach(field => {
                        const fieldName = field.getAttribute('xname').substring(3, field.getAttribute('xname').length);
                        Zeev.Form.Fields[groupmentName][fieldName.toPropertyName()]
                            = new Zeev.Form.Functions.CreateElementMapping('[xname=inp' + fieldName + ']');
                    });

                    Zeev.Form.Fields[groupmentName].DontShow = (clean = false) => {
                        const group = document.querySelector('table[id="' + groupmentId + '"');
                        const tr = Zeev.Form.Functions.ZeevClosest(group, 'tr')

                        if (group && tr) {
                            tr.style.display = 'none';
                            Zeev.Form.Functions.HideAllFields(Zeev.Form.Fields[groupmentName], clean);
                        }
                    };

                    Zeev.Form.Fields[groupmentName].Reveal = () => {
                        const group = document.querySelector('table[id="' + groupmentId + '"');
                        const tr = Zeev.Form.Functions.ZeevClosest(group, 'tr');

                        if (group && tr) {
                            tr.style.display = '';
                            Zeev.Form.Functions.ShowAllFields(Zeev.Form.Fields[groupmentName]);
                        }
                    };
                }

                Zeev.Form.Fields[groupmentName].HideAllFields = () => { Zeev.Form.Functions.HideAllFields(Zeev.Form.Fields[groupmentName]) };
                Zeev.Form.Fields[groupmentName].ShowAllFields = () => { Zeev.Form.Functions.ShowAllFields(Zeev.Form.Fields[groupmentName]) };

            },
            //listOfDates=[Date]; type='max' ou type='min'
            //Ex: GetMaxOrMiniDate([Date]) return maxDate || GetMaxOrMiniDate([Date], 'min') return minDate
            GetMaxOrMiniDate: (listOfDates, type = 'max') => {
                let dt;

                if (listOfDates && listOfDates.length > 0) {
                    if (type.toLowerCase() == 'max') {
                        //pega a maior data
                        dt = new Date(Math.max(...listOfDates));
                    } else {
                        dt = new Date(Math.min(...listOfDates));
                    }
                }

                return dt.toLocaleDateString('pt-BR');
            },
            //date='01/01/2000';days=10,listHolidays=[{desc:"Carnaval", date="12-25" mes-dia '}]
            AddWorkingDays: (date, days, listHolidays) => {
                function _calcNewDate(date, days, direction, listHolidays) {
                    let holidays = false;

                    if (days == 0) {
                        return date;
                    }

                    // adiciona/subtrai um dia 
                    date.addDays(direction);

                    //Verifica se o dia é util
                    let isWeekend = date.getDay() in { 0: 'Sunday', 6: 'Saturday' };

                    listHolidays.forEach(h => {
                        let dateHoliday = new Date(`${date.getFullYear().toString()}-${h.date}`);
                        dateHoliday.setDate(dateHoliday.getDate() + 1);

                        if (dateHoliday.toLocaleDateString('pt-br') == date.toLocaleDateString('pt-br')) {
                            holidays = true;
                        }
                    });

                    //Se for util remove um dia 
                    if ((!isWeekend && !holidays)) {
                        days--;
                    }

                    return _calcNewDate(date, days, direction, listHolidays);
                }

                let newDate = new Date(date.toDate().valueOf());
                let remainingWorkingDays;
                let direction;

                // Remove decimais 
                if (days !== parseInt(days, 10)) {
                    throw new TypeError('AddWorkingDays utiliza apenas dias uteis.');
                }

                // Se zero dias, não realiza mudança 
                if (days === 0) { return '' };

                //Decide soma ou subtração 
                direction = days > 0 ? 1 : -1;

                //decide numero de iterações
                remainingWorkingDays = Math.abs(days);

                // Chamada recursiva
                newDate = _calcNewDate(newDate, remainingWorkingDays, direction, listHolidays);

                return newDate.toLocaleDateString('pt-BR');
            },
            CreatedChecked: function (id, txt, fun) {
                let label = document.createElement('label');
                label.setAttribute('for', id);
                label.classList.add('checkbox');

                let checkbox = document.createElement('input');
                checkbox.setAttribute('id', id);
                checkbox.setAttribute('value', txt);
                checkbox.setAttribute('type', 'checkbox');

                if (fun) checkbox.setAttribute('onclick', fun);

                label.appendChild(checkbox);
                label.append(txt);

                return label;
            },
            Tables: {
                AddActive: (item) => {
                    if (!item)
                        return;
                    Zeev.Form.Functions.RemoveActive(item);
                    if (Zeev.Resources.CustomVariables.CurrentFocus >= item.length)
                        Zeev.Resources.CustomVariables.CurrentFocus = 0;
                    if (Zeev.Resources.CustomVariables.CurrentFocus < 0)
                        Zeev.Resources.CustomVariables.CurrentFocus = (item.length - 1);
                    item[Zeev.Resources.CustomVariables.CurrentFocus].classList.add("autocomplete-active");
                },
                RemoveActive: (item) => {
                    for (let i = 0; i < item.length; i++) {
                        item[i].classList.remove("autocomplete-active");
                    }
                },
                CloseAllLists: (element) => {
                    let item = document.getElementsByClassName("autocomplete-items");
                    for (let i = 0; i < item.length; i++) {
                        if (element !== item[i])
                            item[i].parentNode.removeChild(item[i]);
                    }
                },
                CheckIfFieldIsFill: (field) => {
                    setTimeout(() => {
                        if (!Zeev.Resources.CustomVariables[`${field.attributes['name'].value}Control`])
                            field.value = '';
                        Zeev.Form.Functions.Tables.CloseAllLists()
                    }, 300)
                },
                KeyListControl: () => {
                    let sugestionList = document.getElementById(event.target.id + "autocomplete-list");
                    if (sugestionList) sugestionList = sugestionList.getElementsByTagName("div");
                    if (event.keyCode == 40) {
                        Zeev.Resources.CustomVariables.CurrentFocus++;
                        Zeev.Form.Functions.AddActive(sugestionList);
                    } else if (event.keyCode == 38) {
                        Zeev.Resources.CustomVariables.CurrentFocus--;
                        Zeev.Form.Functions.AddActive(sugestionList);
                    } else if (event.keyCode == 13) {
                        event.preventDefault();
                        if (Zeev.Resources.CustomVariables.CurrentFocus > -1) {
                            if (sugestionList) sugestionList[Zeev.Resources.CustomVariables.CurrentFocus].click();
                        }
                    }
                },
                CreateSugestionList: async (field, dataSource, body) => {
                    let searchValue = field.value;
                    let xName = field.attributes['xname'].value
                    if (!searchValue || searchValue.length <= 3)
                        return;
                    let inp = field;
                    Zeev.Form.Functions.Tables.CloseAllLists(inp);
                    Zeev.Resources.CustomVariables[`${field.attributes['name'].value}Control`] = false;
                    Zeev.Resources.CustomVariables.CurrentFocus = -1;
                    let div = document.createElement("DIV");
                    div.setAttribute("id", field.id + "autocomplete-list");
                    div.setAttribute("class", "autocomplete-items");
                    field.parentNode.appendChild(div);
                    body.inpfilterValue = searchValue.toUpperCase();
                    let itemList = await Zeev.Form.Functions.Tables.GetItemList(body, searchValue, dataSource, xName);
                    if (!itemList) {
                        cryo_alert('Dados não localizados.');
                        return;
                    }
                    if (Array.isArray(itemList))
                        itemList.forEach((item) => { Zeev.Form.Functions.Tables.CreateOptions(div, item, inp, searchValue) })
                    else
                        Zeev.Form.Functions.Tables.CreateOptions(div, itemList, inp, searchValue);
                },
                GetItemList: async (body, searchValue, dataSource, xName) => {
                    return await Zeev.Integration.Functions.ExecuteDataSource(dataSource, body)
                        .then(result => {
                            return result;
                        });
                },
                CreateOptions: (div, item, inp, val) => {
                    let innerDiv = document.createElement("DIV");
                    innerDiv.innerHTML += `${item.cod.replace(val.toUpperCase(), '<strong>' + val.toUpperCase() + '</strong>')} - ${item.txt.replace(val.toUpperCase(), '<strong>' + val.toUpperCase() + '</strong>')}`;
                    innerDiv.innerHTML += `<input type='hidden' id='inpText' value='${item.txt}'>`;
                    innerDiv.innerHTML += `<input type='hidden' id='inpCode' value='${item.cod}'>`;
                    Object.entries(item.fields).forEach((fld) => {
                        innerDiv.innerHTML += `<input type='hidden' id='inp${fld[0]}' value='${fld[1]}'>`
                    })
                    innerDiv.addEventListener("click", function (e) {
                        inp.value = this.querySelector('#inpText').value;
                        this.querySelectorAll('input').forEach((inp) => {
                            let inpForm = inp.closest('tr').querySelector(`[xname="${inp.id}"]`);
                            if (inpForm)
                                inpForm.value = inp.value;
                        })
                        Zeev.Resources.CustomVariables[`${inp.attributes['name'].value}Control`] = true;
                        Zeev.Form.Functions.Tables.CloseAllLists(inp);
                    });
                    div.appendChild(innerDiv);
                },
                TableAppears: (table) => {
                    return !(table.element.querySelectorAll('input[type=hidden]').length == table.element.querySelectorAll('input,select').length)
                },
                MapTableMult: (tableId, tableName = undefined) => {
                    let btnInsertRow = document.querySelector('#btnInsertNewRow') ? "#btnInsertNewRow" : "#BtnInsertNewRow";

                    if (!tableName) tableName = tableId;

                    tableName = tableName.toPropertyName();

                    Zeev.Form.Tables[tableName] = new Zeev.Form.Functions.CreateElementMapping(`#${tableId}`);
                    Zeev.Form.Tables[tableName]['ButtonInsert'] = new Zeev.Form.Functions.CreateElementMapping(btnInsertRow);

                    Zeev.Form.Tables[tableName].Clean = () => {
                        let tbl = Zeev.Form.Tables[tableName].element;

                        if (tbl.getAttribute('mult') == 'S') {
                            var index = 1;
                            let btnDeleteRow = tbl.querySelector("#btnDeleteRow") ? "#btnDeleteRow" : ".btn-delete-mv";

                            tbl.querySelectorAll(btnDeleteRow).forEach(del => {
                                del.closest('tr').querySelectorAll('select,input,textarea').forEach(inp => {
                                        inp.value = '';
                                        if (inp.tagName === 'SELECT') {
                                            inp.dispatchEvent(new Event('change'));
                                        }
                                    });
                                if (index > 1) {
                                    del.onclick();
                                } index++;
                            });
                        }
                    }

                    Zeev.Form.Tables[tableName].InsertRows = (numberLines = 0) => {
                        for (let i = 1; i < numberLines; i++) {
                            Zeev.Form.Tables[tableName]['ButtonInsert'].element.onclick();
                        }
                    };

                    Zeev.Form.Tables[tableName].ValidateMaxRows = (maxRows = 20) => {
                        return Zeev.Form.Tables[tableName].GetRows().length == maxRows;
                    };
                },
            }
        }
    },
    Integration: {
        Settings: {
            TimeOut: 200
        },
        DataSources: {

        },
        Functions: {
            AddDataSource: (name, dataSource) => {
                Zeev.Integration.DataSources[name] = dataSource;
            },
            BuildParamsToGetDataSource: ((params) => {
                let resultParams = '?';
                Object.entries(params).forEach((field, index) => {
                    resultParams += index > 0 ? '&' : '';
                    resultParams += field[0] + "=" + field[1];
                });
                return resultParams;
            }),
            GetUrlDataSource: ((dataSource) => {
                let urlDataSource = '';

                switch (Zeev.Resources.CustomVariables.Environments.toUpperCase()) {
                    case 'DEV':
                        urlDataSource = dataSource.Dev;
                        break;
                    case 'HML':
                        urlDataSource = dataSource.Hml;
                        break;
                    case 'PRD':
                        urlDataSource = dataSource.Prd;
                        break;
                }
                
                return urlDataSource;
            }),
            ExecuteDataSource: (async (dataSource, params, methodVerb = "GET") => {
                if (Zeev.Resources.Native.Loader)
                    Zeev.Resources.Native.Loader.element.style.display = 'block';
                let result = '';
                let strParams = '';
                let myHeaders = new Headers();
                let urlDataSource = Zeev.Integration.Functions.GetUrlDataSource(dataSource);
                let requestOptions = '';
                if (methodVerb.toUpperCase() == 'GET') {
                    requestOptions = {
                        method: 'GET',
                        headers: myHeaders,
                        redirect: 'follow'
                    };
                    if (params)
                        strParams = Zeev.Integration.Functions.BuildParamsToGetDataSource(params);
                }
                if (methodVerb.toUpperCase() == 'POST') {
                    requestOptions = {
                        method: 'POST',
                        headers: myHeaders,
                        redirect: 'follow',
                        body: JSON.stringify(params)
                    };
                }
                let url = urlDataSource + (strParams == '?' ? '' : strParams);
                await fetch(url, requestOptions)
                    .then(response => {
                        const contentType = response.headers.get("content-type");
                        if (contentType && contentType.indexOf("application/json") !== -1) {
                            return response.json().then(data => {
                                return data;
                            }).catch(error => {
                                Zeev.System.Functions.WriteLogConsole(`Fonte de dados: ${dataSource.name}`);
                                throw Error(error);
                            });
                        } else {
                            return response.text().then(text => {
                                Zeev.System.Functions.WriteLogConsole(`Fonte de dados: ${dataSource.name}`);
                                throw Error(text);
                            });
                        }
                    })
                    .then(rst => {
                        if (rst !== null)
                            result = rst.success.length > 1 ? rst.success : rst.success[0];
                        else
                            result = null;
                    })
                    .catch(error => {
                        if (Zeev.Resources.Native.Loader)
                            Zeev.Resources.Native.Loader.element.style.display = 'none';
                        cryo_alert(`Erro na consulta da Fonte de dados <b>'${dataSource.name}'</b>, ${error}`);
                        Zeev.System.Functions.WriteLogConsole(`Fonte de dados: ${dataSource.name}, ${error}`);
                        throw Error(error);
                    });
                if (Zeev.Resources.Native.Loader)
                    Zeev.Resources.Native.Loader.element.style.display = 'none';
                return result;
            }),
        }
    },
    System: {
        TimeOut: 100,
        IsDebug: false,
        Functions: (() => {
            Date.prototype.addDays = function (days) {
                let date = new Date(this.valueOf());
                date.setDate(date.getDate() + days);
                return date;
            }
            Date.prototype.daysRemaining = function (data) {
                const dtNow = this.toLocaleDateString('pt-BR').toDate();
                const dtParameters = data.toDate();
                let days;

                if (dtNow.valueOf() > dtParameters.valueOf()) {
                    days = _calcRemaining(dtNow, dtParameters);
                } else {
                    days = _calcRemaining(dtParameters, dtNow);
                }

                function _calcRemaining(dtMax, dtMin) {
                    return ((dtMax.getTime() - dtMin.getTime()) / (1000 * 3600 * 24));
                }

                return days;
            }
            String.prototype.toDate = function () {
                let dt = this.split('/');
                return new Date(dt[2], parseInt(dt[1]) - 1, dt[0]);
            }
            String.prototype.toNumber = function () {
                return Number(this.split('.').join('').split(',').join('.'));
            }
            String.prototype.toPropertyName = function () {
                if (this.trim().length <= 0) return '';

                let s = this.replace(/\W+(.)/g, function (match, chr) { return chr.toUpperCase(); });
                return s.charAt(0).toUpperCase() + s.slice(1);
            }
            Number.prototype.money = function (decimalPlaces = 2) {
                return this.toLocaleString(undefined, { minimumFractionDigits: decimalPlaces });
            }
            return {
                WriteLogConsole: ((data) => {
                    if (Zeev.System.IsDebug)
                        console.log(data);
                }),
                IncreaseWindowSize: (() => {
                    //Aumenta o tamanho da tela
                    document.getElementById("ContainerForm").parentNode.classList.remove("col-lg-10");
                    document.getElementById("ContainerForm").parentNode.classList.add("col-lg-12");
                }),
                HideBoxCommands: (() => {
                    //Esconde a box do canto esquerdo.
                    document.getElementById("commands").parentNode.style.display = "none";
                }),
                IsNullOrEmptySpace: ((obj) => {
                    let result = true;
                    if (obj !== undefined && obj !== null) {
                        if (obj.constructor === String && obj.trim() !== '' && obj.trim().length > 0)
                            result = false;
                        if (obj.constructor === Object && obj !== {})
                            result = false;
                        if (obj.constructor === Array && obj.length > 0)
                            result = false;
                    }
                    return result;
                }),
            }
        })(),
    },
    Controller: {
        
    }
};
/*v1.1*/
