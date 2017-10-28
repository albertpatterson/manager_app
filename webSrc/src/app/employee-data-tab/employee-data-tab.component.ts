import { Component, OnInit} from '@angular/core';

import { DatabaseService } from '../services/database.service';

import { Employee } from "../utils/Employee";
import { Filter } from "../utils/Filter";
import { SingleActivationManager } from "../utils/SingleActivationManager";


const overlays: string[] = ["updateForm", "filterForm"];

@Component({
  selector: 'app-employee-data-tab',
  templateUrl: './employee-data-tab.component.html',
  styleUrls: ['./employee-data-tab.component.css'],
  inputs:["display"]
})
export class EmployeeDataTabComponent implements OnInit{

  public display: string;

  public headers: string[];
  public rowData: string[][];

  private _employee: Employee;
  public employeeSnapshot: Employee;
  public filter: Filter;
  public overlayVisibilityManager: SingleActivationManager;
  public loading: boolean;

  constructor(private databaseService: DatabaseService) { }

  ngOnInit(){
    this._setEmployee(null, null, null, null, null,null, null, null, null, null);
    this.filter = new Filter(true, true, 1e3);
    this.overlayVisibilityManager = new SingleActivationManager(overlays, "visible", "hidden");
    this.loading = false;
  }

  updateEmployee(updatedEmployee: Employee): void{
    console.log("update!", this._employee, updatedEmployee);
      if(this._employee.salary !== updatedEmployee.salary){
        this.databaseService.updateEmployee(this._employee.emp_no, {"salary": updatedEmployee.salary})
        .then(()=>alert('updated'))
        .catch(e=>console.log(e))
      }
  }

  fetchData(){
    console.log(this.filter);
    this._clearData();
    this.loading = true;
    this.databaseService.getFullEmployeeData(this.filter)
    .then(data=>{this._updateData(data); this.loading=false;})
    .catch(e=>console.log(e));
  }

  private _updateData(data: any):void{
    this.headers=data.columnNames;
    this.rowData=data.data;
    this.overlayVisibilityManager.deactivateAll();
  }
  private _clearData():void{
    this.headers=[];
    this.rowData=[[]];
  }

  showUpdateForm(itemCoords: number[]){    
    var row = itemCoords[0];
    this._setEmployee(
      this.rowData[row][0],
      this.rowData[row][1],
      this.rowData[row][2],
      this.rowData[row][3],
      this.rowData[row][4],
      this.rowData[row][5],
      this.rowData[row][6],
      this.rowData[row][7],
      this.rowData[row][8],
      this.rowData[row][9]
    )
    this.overlayVisibilityManager.activate("updateForm");
  }

  addEmployee(){
    this._setEmployee(null,null,null,null,null,null,null,null,null,null);
    this.overlayVisibilityManager.activate("updateForm");
  }

  showFilterForm(){
    this.overlayVisibilityManager.activate("filterForm");
  }

  private _setEmployee(...any){
    this._employee = new Employee(
      arguments[0], arguments[1], arguments[2] ,arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8], arguments[9]);
    this.employeeSnapshot = JSON.parse(JSON.stringify(this._employee));
  }
}