export class API_URL_CONSTANT {

	public static API_ROOT = "http://localhost:1009/";
	// public static API_ROOT = "http://27.72.89.79:8084/pmbackend/";
	// public static API_ROOT = "http://192.168.0.238:9086/pmbackend/";

  public static API_FILE = {
    UPLOADS: "file/uploadMultipleFiles",
    DOWNLOD: "file/fileStore?fileName=",
    UPLOAD: "file/uploadFile",
    DELETED: "file/deleteFile"
  };

  public static MENU = {
    FOR_ROLE: "api/adminMenu/getMenuForRoles",
    SEARCH: "api/adminMenu/searchMenus",
    PARENT: "api/adminMenu/getParentMenu",
    SAVE_OR_UPDATE: "api/adminMenu/saveOrUpdate",
    GET_ROLE_FOR_MENU: "api/adminMenu/menuRolesGrant",
    DELETED: "api/adminMenu/deletedMenu",
    SEARCH_SUBMENU: "api/adminMenu/searchSubMenus"
  };

  public static USERS = {
    INFO: "api/adminUsers/getUserInfo",
    SEARCH: "api/adminUsers/searchUsers",
    GET_ROLE_FOR_USERS: "api/adminUsers/getUsersForRoles",
    SAVE_OR_UPDATE: "api/adminUsers/saveOrUpdate",
    DELETED: "api/adminUsers/deletedUsers",
    GRANT_ROLE: "api/adminUsers/grantRoleForUser",
    LOCK_UNLOCK: "api/adminUsers/lockOrUnlock",
    FOR_GOT_PASS: "api/adminUsers/forgotPass"
  };
  public static ATMS = {
    SAVE_OR_UPDATE: "api/adminAtm/saveOrUpdate",
    SEARCH: "api/adminAtm/searchAtms",
    DELETED: "api/adminAtm/deletedAtm",
    LOCK_UNLOCK: "api/adminAtm/lockOrUnlock"
  };

  public static ADDR = {
    ALL: "api/adminAddress/all",
    ADDR_PROVINCE: "api/adminAddress/getAllProvinces",
    ADDR_DISTRICT: "api/adminAddress/getDistrictByProvinceCode",
    ADDR_WARD: "api/adminAddress/getWardByDistrictCode"
  };
  public static STAFF = {
    SEARCH: "api/adminStaff/searchDataStaff",
    POSITION: {
      GET_POSITION: "api/adminStaffPosition/getPosition"
    },
    SAVEORUPDATE: "api/adminStaff/saveOrUpdate",
    DELETED: "api/adminStaff/deleteStaff",
    GET_BY_BRANCH: "api/adminStaff/staffByBranch",
    GET_STAFF_BY_BRANCH_ID_NO_DELETED: "api/adminStaff/getStaffByBranchIdNoDeleted",
    GET_STAFF_BY_BRANCH_FOR_STORAGES: "api/adminStaff/getStaffByBranchForStorages",
    LOCK_UNLOCK:"api/adminStaff/lockOrUnlock",
    // GET_STAFF_BY_BRANCH_NO_STORGES:"api/adminStaff/getStaffBybranchNoStorges"
    // IS_EXIT_IN_USERS:"api/adminStaff/isExitStaffInUsers"
  };
  public static CARS = {
    SEARCH: "api/adminCars/searchCars",
    DELETED: "api/adminCars/deletedCars",
    SAVE_OR_UPDATE: "api/adminCars/saveOrUpdate",
    GET_CARSTYPE: "api/adminCarsType/all",
    GET_BRANCH: "api/adminBranch/all",
    GET_TICKET: "api/adminCarsTicket/all"
  };

  public static BRANCH = {
    GET_ALL: "api/adminBranch/getAllBranch",
    // GET_BRANCH_ACTIVE:"api/adminBranch/getBranchActive",
    SEARCH: "api/adminBranch/searchBranch",
    SAVE_OR_UPDATE: "api/adminBranch/saveOrUpdate",
    DELETED: "api/adminBranch/deleteBranch",
    LOCK_UNLOCK: "api/adminBranch/lockOrUnlock",
    UPDATE_STAFF_ID: "api/adminBranch/updateStaffId"
  };

  public static STORAGES = {
    GET_ALL: "api/adminStorages/getAll",
    SEARCH: "api/adminStorages/searchData",
    GET_STAFF: "api/adminStorages/getStaff",
    SAVE_OR_UPDATE: "api/adminStorages/saveOrUpdate",
    GET_STORAGES_NO_DEL: "api/adminStorages/getStorages",
    LOCK_UNLOCK: "api/adminStorages/lockOrUnlock",
    DELETED: "api/adminStorages/deleteStor"
  };

  public static ADDRESS = {
    ADDR_PROVINCE: "api/adminAddress/getAllProvinces",
    ADDR_DISTRICT: "api/adminAddress/getDistrictByProvinceCode",
    ADDR_WARD: "api/adminAddress/getWardByDistrictCode"
  };

  public static REQUEST = {
    SEARCH: "api/atmRequest/searchData",
    GET_ATM_BY_BRANCH_CODE: "api/adminAtm/getAtmByBranchCode",
    GET_BRANCH: "api/adminBranch/getBranchByStatusAndDeleted"
  };

  public static HIS_REQUEST = {
    GET_HIS: "api/hisAtmRequest/getHisRequestByRequestId"
  };

  public static CASSTTE = {
    SAVE_OR_UPDATE: "api/adminCasstte/saveOrUpdate",
    SEARCH: "api/adminCasstte/searchCasstte",
    DELETED: "api/adminCasstte/deletedCasstte",
    ALL_STORAGE: "api/adminStorages/getAll"
  };

  public static CASSTTE_TYPE = {
    ALL: "api/adminCasstteType/getAll",
    GET_BY_ID: "api/adminCasstteType"
  };

  public static MANAGER_REQUEST = {
    SEARCH: "api/roadMap/searchData"
  }
}
